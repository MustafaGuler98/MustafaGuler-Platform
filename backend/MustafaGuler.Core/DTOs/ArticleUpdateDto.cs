using System;

namespace MustafaGuler.Core.DTOs
{
    public class ArticleUpdateDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid CategoryId { get; set; }
        public string LanguageCode { get; set; }
        public string? MainImage { get; set; }
    }
}
