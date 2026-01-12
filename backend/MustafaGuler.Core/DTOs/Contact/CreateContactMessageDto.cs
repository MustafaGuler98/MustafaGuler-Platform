namespace MustafaGuler.Core.DTOs.Contact
{
    public class CreateContactMessageDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Message { get; set; } = null!;
        public bool AllowPromo { get; set; } = false;
    }
}
