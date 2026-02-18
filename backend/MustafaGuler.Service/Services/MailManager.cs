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
        private readonly ISecurityService _securityService;

        public MailManager(IConfiguration configuration, ILogger<MailManager> logger, ISecurityService securityService)
        {
            _configuration = configuration;
            _logger = logger;
            _securityService = securityService;
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

                var safeSenderName = _securityService.SanitizeForHeader(message.SenderName);
                var safeSubject = _securityService.SanitizeForHeader(message.Subject);

                var safeSenderEmail = _securityService.SanitizeEmail(message.SenderEmail);

                var htmlSenderName = _securityService.SanitizeForHtml(message.SenderName);
                var htmlSenderEmail = _securityService.SanitizeForHtml(message.SenderEmail);
                var htmlSubject = _securityService.SanitizeForHtml(message.Subject);
                
                var htmlMessageBody = _securityService.SanitizeForHtml(message.MessageBody).Replace("\n", "<br />");


                var email = new MimeMessage();
                email.From.Add(new MailboxAddress("Website Contact Form", fromEmail));
                email.To.Add(MailboxAddress.Parse(toEmail));

                email.ReplyTo.Add(new MailboxAddress(safeSenderName, safeSenderEmail));
                email.Subject = $"[Contact Form] {safeSubject}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> {htmlSenderName}</p>
                        <p><strong>Email:</strong> {htmlSenderEmail}</p>
                        <p><strong>Subject:</strong> {htmlSubject}</p>
                        <p><strong>Allow Promo:</strong> {(message.AllowPromo ? "Yes" : "No")}</p>
                        <p><strong>IP Address:</strong> {message.ClientIp ?? "Unknown"}</p>
                        <hr />
                        <p><strong>Message:</strong></p>
                        <p>{htmlMessageBody}</p>
                    ",
                    TextBody = $"Name: {safeSenderName}\nEmail: {safeSenderEmail}\nSubject: {safeSubject}\nAllow Promo: {(message.AllowPromo ? "Yes" : "No")}\nIP: {message.ClientIp}\n\nMessage:\n{message.MessageBody}"
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
