using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Repository
{
    public interface IMailService
    {
        void SendMail( string to, string subject, string html);
    }
}
