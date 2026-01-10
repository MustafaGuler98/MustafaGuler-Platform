using System;
using System.Linq;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Parameters;

namespace MustafaGuler.Service.Extensions
{
    public static class ArticleQueryExtensions
    {
        // Applies dynamic sorting to the article query.
        // Supported fields: title, category, language, views, createddate (default).
        public static IOrderedQueryable<Article> ApplySorting(
            this IQueryable<Article> query,
            ArticleQueryParams queryParams)
        {
            var isAscending = string.Equals(queryParams.SortOrder, "asc", StringComparison.OrdinalIgnoreCase);

            return queryParams.SortBy?.ToLower() switch
            {
                "title" => isAscending
                    ? query.OrderBy(x => x.Title)
                    : query.OrderByDescending(x => x.Title),
                "category" => isAscending
                    ? query.OrderBy(x => x.Category != null ? x.Category.Name : "")
                    : query.OrderByDescending(x => x.Category != null ? x.Category.Name : ""),
                "language" => isAscending
                    ? query.OrderBy(x => x.LanguageCode)
                    : query.OrderByDescending(x => x.LanguageCode),
                "views" => isAscending
                    ? query.OrderBy(x => x.ViewCount)
                    : query.OrderByDescending(x => x.ViewCount),
                _ => isAscending
                    ? query.OrderBy(x => x.CreatedDate)
                    : query.OrderByDescending(x => x.CreatedDate)
            };
        }
    }
}
