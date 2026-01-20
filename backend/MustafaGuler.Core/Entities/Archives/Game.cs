using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.Entities.Archives
{
    public class Game : BaseMediaEntity
    {
        public string? Platform { get; set; }
        public string? Developer { get; set; }
        public int? ReleaseYear { get; set; }
        public int? PlaytimeHours { get; set; }
        public GameStatus Status { get; set; } = GameStatus.Backlog;
    }
}
