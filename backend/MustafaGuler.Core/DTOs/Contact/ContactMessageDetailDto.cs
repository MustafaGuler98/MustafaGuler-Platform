namespace MustafaGuler.Core.DTOs.Contact
{
    public class ContactMessageDetailDto
    {
        public Guid Id { get; set; }
        public string SenderName { get; set; } = null!;
        public string SenderEmail { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string MessageBody { get; set; } = null!;
        public bool AllowPromo { get; set; }
        public string? ClientIp { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsMailSent { get; set; }
        public bool IsReplied { get; set; }
    }
}
