using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Server.DataBase;
using Server.Repository;
using Server.DBModels;
using Server.Models;
using Server.Tools;

namespace angularapi.Controllers
{
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DbRpi _context;
        private readonly ILogger<UserController> _logger;
        private IUserService _userService;
        public static string BaseUrl;
        private IMailService _mailService;
        public UserController(DbRpi context, IUserService userService,
            ILogger<UserController> logger, IMailService mailService)
        {
            _context = context;
            _userService = userService;
            _logger = logger;
            _mailService = mailService;
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult Register(User user)
        {
            try
            {
                _userService.CreateAsync(user);
                return Ok(new { message = "Registration successful, please check your email for verification instructions" });
            }
            catch (ApplicationException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login(AuthModel model)
        {
            (var user, string refreshToken) = _userService.AuthenticateLogin(model.Name, model.Password);
            if (user == null)
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }
            return Ok(new
            {
                ID = user.ID,
                Name = user.Name,
                AccessToken = TokenManager.GenerateAccessToken(user.Name),
                RefreshToken = refreshToken
            });
        }
        [Authorize(AuthenticationSchemes = "refresh")]
        [HttpGet("refreshToken", Name = "refresh")]
        public IActionResult RefreshToken()
        {
            Claim refreshToken = User.Claims.FirstOrDefault(x => x.Type == "refresh");
            Claim username = User.Claims.FirstOrDefault(x => x.Type == "user");
            try
            {
                Tokens tokens = _userService.Refresh(username, refreshToken);
                return Ok(new
                {
                    AccessToken = tokens.AccessToken,
                    RefreshToken = tokens.RefreshToken
                });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost("resetPassword")]
        [AllowAnonymous]
        public IActionResult ResetPassword([FromBody] NewPassword newPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var user = _context.User.FirstOrDefault(s => s.Email == newPassword.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Nie istnieje użytkownik o takim emailu" });
            }
            user.ResetPasswordToken = TokenManager.RandomTokenString();

            string resetPasswordtoken = TokenManager.GenerateResetPassToken(user.ResetPasswordToken, user.Email);
            _context.User.Update(user);
            _context.SaveChanges();
            string message = $@"<p>Wysłano powiadomienie o zresetowaniu hasła</p>
                                <p>Kliknij link aby dokończyć resetowanie</p>
                             <p> <a href=""{BaseUrl}new-password?token={resetPasswordtoken}""> link <a/> </p>";
            _mailService.SendMail(newPassword.Email, "Resetowanie Hasła", message);
            return Ok(new { message = "Link do zresetowania hasło został wysłany na twój e-mail" });

        }
        [HttpPost("verify-resetpassword")]
        [AllowAnonymous]
        public IActionResult VerifyPaswordToken([FromBody] VerifyEmailRequest token)
        {
            bool result = _userService.VerifyPasswordToken(token.Token);
            string email = TokenManager.ValidateJwtToken(token.Token, "email");

            if (result)
            {
                return Ok(new { email = email });
            }
            return BadRequest(new { message = "Token wygasł lub jest nieprawidłowy" });
        }
        [HttpPost("setPassword")]
        [AllowAnonymous]
        public IActionResult SetNewPassword([FromBody] NewPassword data)
        {
            var user = _context.User.FirstOrDefault(s => s.Email == data.Email);
            if (user != null)
            {
                string passwordHash = SecurePasswordHasher.Hash(data.Password);
                user.Password = passwordHash;
                _context.User.Update(user);
                _context.SaveChanges();
                return Ok(new { message = "Zmieniono hasło" });
            }
            return BadRequest(new { message = "Coś poszło nie tak, spróbuj ponownie" });
        }
        [HttpPost("verify-email")]
        [AllowAnonymous]
        public IActionResult VerifyEmail([FromBody] VerifyEmailRequest verifyEmail)
        {
            bool result = _userService.VerifyEmail(verifyEmail.Token);
            if (result)
            {
                return Ok(new { message = "Verification successful, you can now login" });
            }
            return BadRequest(new { message = "Invalid access token" });
        }



    }
}
