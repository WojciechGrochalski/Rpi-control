using angularapi.Controllers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.DataBase;
using Server.DBModels;
using Server.Models;
using Server.Repository;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Server.Tools
{
    public class UserService : IUserService
    {
        private readonly DbRpi _context;
        private readonly ILogger<BackgroundService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private IMailService _mailService;

        string subject = "Sign-up Verification API - Verify Email";
        public UserService(DbRpi context,
            ILogger<BackgroundService> logger,
            IServiceScopeFactory scopeFactory,
               IMailService mailService)
        {
            _context = context;
            _logger = logger;
            _scopeFactory = scopeFactory;
            _mailService = mailService;
        }


        public (User,string ) AuthenticateLogin(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return (null,null);
            }

            var user = _context.User.SingleOrDefault(x => x.Name == username);

            // check if username exists
            if (user == null)
            {
                return (null, null);
            }

            // check if password is correct
            if (!SecurePasswordHasher.Verify(password, user.Password))
            {
                return (null, null);
            }

            // authentication successful
            var rows = _context.RefreshTokens.Where(x => x.UserID == user.ID).ToList();
            foreach (RefreshToken item in rows)
            {
                _context.RefreshTokens.Remove(item);
            }
            _context.SaveChanges();
   
            var newToken = TokenManager.GenerateRefreshToken(user.Name);
            RefreshToken refreshToken = new RefreshToken(newToken.refreshTokenKey,user.ID);
            _context.RefreshTokens.Add(refreshToken);
            _context.SaveChanges();
            return (user, newToken.jwt);
        }
        public User CreateAsync(User user)
        {
            // validation
            if (string.IsNullOrWhiteSpace(user.Password))
            {
                throw new ApplicationException("Password is required");
            }

            if (_context.User.Any(x => x.Name == user.Name))
            {
                throw new ApplicationException("Username " + user.Name + " is already taken");
            }
            if (_context.User.Any(x => x.Email == user.Email))
            {
                throw new ApplicationException("Email " + user.Email + " is already taken");
            }

            string PasswordHash = SecurePasswordHasher.Hash(user.Password);

            user.Password = PasswordHash;
            user.Created = DateTime.Now;
            user.IsVerify = false;
            user.VeryficationToken = TokenManager.RandomTokenString();
            _context.User.Add(user);
            _context.SaveChanges();

            string message = $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                             <p> <a href=""{UserController.BaseUrl}verify-user?token={TokenManager.GenerateRegisterToken(user.VeryficationToken)}""> link <a/> </p>";

            _mailService.SendMail(user.Email, subject, message);
            BackgroundTask task = new BackgroundTask(_logger, _scopeFactory);
            Task.Factory.StartNew(() => task.RemoveUnverifiedUserAsync(user.VeryficationToken));

            return user;
        }
        public bool VerifyEmail(string token)
        {
            try
            {
                string verifyToken = TokenManager.ValidateJwtToken(token);
                if (verifyToken == null)
                {
                    return false;
                }
                var account = _context.User.SingleOrDefault(x => x.VeryficationToken == verifyToken);

                if (account == null)
                {
                    return false;
                }
                account.IsVerify = true;
                account.VeryficationToken = null;

                _context.User.Update(account);
                _context.SaveChanges();
                return true;
            }
            catch (ApplicationException e)
            {
                throw new ApplicationException(e.Message);
            }

        }
        public bool VerifyPasswordToken(string token)
        {
            try
            {
                string verifyToken = TokenManager.ValidateJwtToken(token);
                if (verifyToken == null)
                {
                    return false;
                }
                var account = _context.User.SingleOrDefault(x => x.ResetPasswordToken == verifyToken);

                if (account == null)
                {
                    return false;
                }
                account.ResetPasswordToken = null;

                _context.User.Update(account);
                _context.SaveChanges();
                return true;
            }
            catch (ApplicationException e)
            {
                throw new ApplicationException(e.Message);
            }

        }


        public Tokens Refresh(Claim userClaim, Claim refreshClaim)
        {
            var user = _context.User.FirstOrDefault(s => s.Name == userClaim.Value);
            if (user == null)
            {
                throw new ApplicationException("User doesn't exist");
            }
            RefreshToken token = _context.RefreshTokens.FirstOrDefault(s => s.UserID == user.ID && s.Token == refreshClaim.Value);

            if (token != null)
            {
                
                var newToken= TokenManager.GenerateRefreshToken(user.Name);
                RefreshToken refreshToken = new RefreshToken(newToken.refreshTokenKey, user.ID);

                _context.RefreshTokens.Add(refreshToken);

                _context.RefreshTokens.Remove(token);
                _context.SaveChanges();

                return new Tokens
                {
                    AccessToken = TokenManager.GenerateAccessToken(user.Name),
                    RefreshToken = newToken.jwt
                };
            }
            else
            {
                throw new ApplicationException("Refresh token incorrect");
            }
        }
    }
}
