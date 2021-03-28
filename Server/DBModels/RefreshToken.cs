
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DBModels
{
    public class RefreshToken
    {
        public int ID { get; set; }
        public string Token { get; set; }
        public int UserID { get; set; }
        public User User { get; set; }

        public RefreshToken(string token, int userID)
        {
            Token = token;
            UserID = userID;
        }

    }   
}
