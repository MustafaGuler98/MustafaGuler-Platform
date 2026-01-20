using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.DTOs.Archives
{
    public class TTRPGDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? System { get; set; }
        public string? CampaignName { get; set; }
        public TTRPGRole Role { get; set; }
        public CampaignStatus CampaignStatus { get; set; }
        public int? SessionCount { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateTTRPGDto
    {
        public string Title { get; set; } = null!;
        public string? System { get; set; }
        public string? CampaignName { get; set; }
        public TTRPGRole Role { get; set; } = TTRPGRole.Player;
        public CampaignStatus CampaignStatus { get; set; } = CampaignStatus.Active;
        public int? SessionCount { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
    }

    public class UpdateTTRPGDto : CreateTTRPGDto { }
}
