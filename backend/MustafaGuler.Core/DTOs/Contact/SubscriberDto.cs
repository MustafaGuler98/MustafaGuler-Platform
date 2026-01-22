namespace MustafaGuler.Core.DTOs.Contact
{
    public class SubscriberDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public string? Source { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
    }
}
