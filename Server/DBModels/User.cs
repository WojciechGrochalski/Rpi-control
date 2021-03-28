
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Server.DBModels
{
    public class User 
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string VeryficationToken { get; set; }
        public string ResetPasswordToken { get; set; }
        public bool IsVerify { get; set; }
        public DateTime Created { get; set; }
        public List<GPIO> GPIOs { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; }
    }
}
