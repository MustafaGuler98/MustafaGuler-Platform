using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.Entities.Archives
{
    public class Anime : BaseMediaEntity
    {
        public int? Episodes { get; set; }
        public int? CurrentEpisode { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Studio { get; set; }
        public WatchStatus Status { get; set; } = WatchStatus.PlanToWatch;
    }
}
