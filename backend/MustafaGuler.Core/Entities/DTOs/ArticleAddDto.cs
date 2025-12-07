using System;

namespace MustafaGuler.Core.DTOs
{
    public class ArticleAddDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid CategoryId { get; set; }
        public string LanguageCode { get; set; } // "tr", "en"
        public string? MainImage { get; set; }

    }
}