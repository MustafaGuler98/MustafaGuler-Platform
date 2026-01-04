using System;
using System.Collections.Generic;
using System.Text;

namespace MustafaGuler.Core.DTOs
{
    public class ArticleListDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string LanguageCode { get; set; } = null!;
        public int ViewCount { get; set; }
        public DateTime CreatedDate { get; set; }

    
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string MainImage { get; set; } = null!;
    }
}
