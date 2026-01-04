using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities
{
    public class Article : BaseEntity
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? MainImage { get; set; } // URL or path to the main image, null if none
        public string LanguageCode { get; set; } = null!; // "tr", "en"
        public Guid GroupId { get; set; } // Connects different language versions of the same article
        public int ViewCount { get; set; } = 0;
        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }

        public Guid UserId { get; set; } 
        public AppUser User { get; set; } = null!;
    }
}