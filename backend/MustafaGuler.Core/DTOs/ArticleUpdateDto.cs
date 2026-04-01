using System;

namespace MustafaGuler.Core.DTOs
{
    public class ArticleUpdateDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? ContentHtml { get; set; }
        public Guid CategoryId { get; set; }
        public string LanguageCode { get; set; } = null!;
        public string? MainImage { get; set; }
    }
}
