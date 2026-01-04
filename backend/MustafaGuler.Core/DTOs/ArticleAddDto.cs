using System;

namespace MustafaGuler.Core.DTOs
{
    public class ArticleAddDto
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public Guid CategoryId { get; set; }
        public string LanguageCode { get; set; } = null!; // "tr", "en"
        public string? MainImage { get; set; }

    }
}