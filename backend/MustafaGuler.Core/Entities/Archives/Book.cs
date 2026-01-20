using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.Entities.Archives
{
    public class Book : BaseMediaEntity
    {
        public string Author { get; set; } = null!;
        public int? PageCount { get; set; }
        public int? CurrentPage { get; set; }
        public int? PublishYear { get; set; }
        public ReadingStatus ReadingStatus { get; set; } = ReadingStatus.PlanToRead;
    }
}
