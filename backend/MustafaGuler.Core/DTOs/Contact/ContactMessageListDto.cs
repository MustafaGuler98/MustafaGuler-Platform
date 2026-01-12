namespace MustafaGuler.Core.DTOs.Contact
{
    public class ContactMessageListDto
    {
        public Guid Id { get; set; }
        public string SenderName { get; set; } = null!;
        public string SenderEmail { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string MessagePreview { get; set; } = null!; // First 100 chars
        public DateTime CreatedDate { get; set; }
        public bool IsMailSent { get; set; }
        public bool IsReplied { get; set; }
    }
}
