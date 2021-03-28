using JWT.Algorithms;
using JWT.Builder;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Server.Tools
{
    public static class TokenManager
    {
        private static readonly string _secret = "Superlongsupersecret!";

        public static string GenerateRegisterToken(string token)
        {
            return new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(Encoding.ASCII.GetBytes(_secret))
                .AddClaim("exp", DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds())
                .AddClaim("token", token)
                .Encode();
        }
        public static string GenerateResetPassToken(string token,string email)
        {
            return new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(Encoding.ASCII.GetBytes(_secret))
                .AddClaim("exp", DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds())
                .AddClaim("token", token)
                .AddClaim("email",email)
                .Encode();
        }

        public static string GenerateAccessToken(string user)
        {
            return new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(Encoding.ASCII.GetBytes(_secret))
                .AddClaim("exp", DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds())
                .AddClaim("user", user)
                .Audience("access")
                .Encode();
        }
        public static (string refreshTokenKey, string jwt) GenerateRefreshToken(string user)
        {
            string key = RandomTokenString();
            string jwt= new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(Encoding.ASCII.GetBytes(_secret))
                .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(2).ToUnixTimeSeconds())
                .AddClaim("refresh", key)
                .AddClaim("user", user)
                .Audience("refresh")
                .Encode();
            return (key, jwt);
        }

        public static IDictionary<string, object> VerifyToken(string token)
        {
            return new JwtBuilder()
                 .WithSecret(_secret)
                 .MustVerifySignature()
                 .Decode<IDictionary<string, object>>(token);
        }
        public static string ValidateJwtToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secret);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                string randomToken = jwtToken.Claims.First(x => x.Type == "token").Value;

                // return account id from JWT token if validation successful
                return randomToken;
            }
            catch
            {
                // return null if validation fails
                return null;
            }
        }
        public static string ValidateJwtToken(string token,string claim)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secret);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                string randomToken = jwtToken.Claims.First(x => x.Type == claim).Value;

                // return account id from JWT token if validation successful
                return randomToken;
            }
            catch
            {
                // return null if validation fails
                return null;
            }
        }

        public static string RandomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[38];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

    }
}
