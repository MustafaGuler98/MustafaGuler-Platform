using System;
using System.Collections.Generic;
using System.Text;

namespace MustafaGuler.Core.DTOs
{
    public class ArticleListDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string LanguageCode { get; set; }
        public int ViewCount { get; set; }
        public DateTime CreatedDate { get; set; }

    
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Author { get; set; }
        public string MainImage { get; set; }
    }
}
