using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities
{
    public class ContactMessage : BaseEntity
    {
        public string SenderName { get; set; } = null!;
        public string SenderEmail { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string MessageBody { get; set; } = null!;
        public bool AllowPromo { get; set; } = false;
        public string? ClientIp { get; set; }
        public bool IsMailSent { get; set; } = false;
        public bool IsReplied { get; set; } = false;
    }
}
