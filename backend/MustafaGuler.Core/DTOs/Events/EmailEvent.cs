
namespace MustafaGuler.Core.DTOs.Events
{
    public record EmailEvent
    {
        public Guid ContactMessageId { get; init; }
        public string SenderName { get; init; } = null!;
        public string SenderEmail { get; init; } = null!;
        public string Subject { get; init; } = null!;
        public string MessageBody { get; init; } = null!;
        public bool AllowPromo { get; init; }
        public string? ClientIp { get; init; }
        public DateTime EnqueuedAt { get; init; }
    }
}
