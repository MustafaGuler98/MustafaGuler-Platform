using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.Entities.Archives
{
    public class TvSeries : BaseMediaEntity
    {
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public int? TotalSeasons { get; set; }
        public int? TotalEpisodes { get; set; }
        public int? CurrentEpisode { get; set; }
        public WatchStatus Status { get; set; } = WatchStatus.PlanToWatch;
    }
}
