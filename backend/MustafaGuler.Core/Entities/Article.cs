using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities
{
    public class Article : BaseEntity
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string LanguageCode { get; set; } // "tr", "en"
        public Guid GroupId { get; set; } // Connects different language versions of the same article
        public int ViewCount { get; set; } = 0;
        public Guid? CategoryId { get; set; }
        public Category Category { get; set; }
    }
}