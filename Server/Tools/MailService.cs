using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.Extensions.Options;
using Server.Repository;

namespace Server.Tools
{
    public class MailService: IMailService
    {
        private readonly AppSettings _appSettings;

        public MailService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        public void SendMail( string to, string subject, string html)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("cash-service@email.com"));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = html };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_appSettings.SmtpHost, _appSettings.SmtpPort, SecureSocketOptions.StartTls);
            smtp.Authenticate(_appSettings.SmtpUser, _appSettings.SmtpPass);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
