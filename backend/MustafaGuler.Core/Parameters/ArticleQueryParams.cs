using System;

namespace MustafaGuler.Core.Parameters
{
    public class ArticleQueryParams : PaginationParams
    {
        public string? LanguageCode { get; set; }
        public Guid? CategoryId { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; }
    }
}
