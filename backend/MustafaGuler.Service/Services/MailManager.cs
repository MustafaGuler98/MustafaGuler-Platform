using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;

namespace MustafaGuler.Service.Services
{
    public class MailManager : IMailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<MailManager> _logger;

        public MailManager(IConfiguration configuration, ILogger<MailManager> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendContactEmailAsync(ContactMessage message)
        {
            try
            {
                var host = _configuration["MailSettings:Host"];
                var port = int.Parse(_configuration["MailSettings:Port"] ?? "587");
                var user = _configuration["MailSettings:User"];
                var password = _configuration["MailSettings:Password"];
                var fromEmail = _configuration["MailSettings:FromEmail"];
                var toEmail = _configuration["MailSettings:ToEmail"];

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress("Website Contact Form", fromEmail));
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.ReplyTo.Add(new MailboxAddress(message.SenderName, message.SenderEmail));
                email.Subject = $"[Contact Form] {message.Subject}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> {message.SenderName}</p>
                        <p><strong>Email:</strong> {message.SenderEmail}</p>
                        <p><strong>Subject:</strong> {message.Subject}</p>
                        <p><strong>Allow Promo:</strong> {(message.AllowPromo ? "Yes" : "No")}</p>
                        <p><strong>IP Address:</strong> {message.ClientIp ?? "Unknown"}</p>
                        <hr />
                        <p><strong>Message:</strong></p>
                        <p>{System.Net.WebUtility.HtmlEncode(message.MessageBody).Replace("\n", "<br />")}</p>
                    ",
                    TextBody = $"Name: {message.SenderName}\nEmail: {message.SenderEmail}\nSubject: {message.Subject}\nAllow Promo: {(message.AllowPromo ? "Yes" : "No")}\nIP: {message.ClientIp}\n\nMessage:\n{message.MessageBody}"
                };
                email.Body = bodyBuilder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(user, password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation("Contact email sent successfully to {ToEmail} from {SenderEmail}", toEmail, message.SenderEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact email from {SenderEmail}", message.SenderEmail);
                return false;
            }
        }
    }
}
