using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.Entities.Archives
{
    public class TTRPG : BaseMediaEntity
    {
        public string? System { get; set; } // D&D 5e, Pathfinder, Call of Cthulhu, etc.
        public string? CampaignName { get; set; }
        public TTRPGRole Role { get; set; } = TTRPGRole.Player;
        public CampaignStatus CampaignStatus { get; set; } = CampaignStatus.Active;
        public int? SessionCount { get; set; }
    }
}
