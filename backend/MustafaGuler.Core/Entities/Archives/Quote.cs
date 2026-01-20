using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities.Archives
{
    public class Quote : BaseEntity
    {
        public string Content { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string? Source { get; set; }
    }
}
