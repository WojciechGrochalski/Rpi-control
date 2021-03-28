using Server.DBModels;
using Server.Models;
using System.Security.Claims;

namespace Server.Repository
{
    public interface IUserService
    {
        (User, string) AuthenticateLogin(string username, string password);

        User CreateAsync(User user);
        bool VerifyEmail(string token);

        bool VerifyPasswordToken(string token);
        Tokens Refresh(Claim username, Claim refreshtoken);
        //void Update(User user, string password = null);
        //void Delete(int id);
    }
}
