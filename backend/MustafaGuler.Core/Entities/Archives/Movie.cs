using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.Entities.Archives
{
    public class Movie : BaseMediaEntity
    {
        public string Director { get; set; } = null!;
        public int? ReleaseYear { get; set; }
        public int? DurationMinutes { get; set; }
        public WatchStatus Status { get; set; } = WatchStatus.PlanToWatch;
    }
}
