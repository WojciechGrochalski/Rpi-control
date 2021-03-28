using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class NewPassword
    {
        public string Password { get; set; }
        public string Email { get; set; }
    }
}

