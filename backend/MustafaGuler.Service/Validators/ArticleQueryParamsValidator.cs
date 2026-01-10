using FluentValidation;
using MustafaGuler.Core.Parameters;

namespace MustafaGuler.Service.Validators
{
    public class ArticleQueryParamsValidator : AbstractValidator<ArticleQueryParams>
    {
        private static readonly string[] ValidSortFields = { "title", "createddate", "category", "language", "views" };
        private static readonly string[] ValidSortOrders = { "asc", "desc" };

        public ArticleQueryParamsValidator()
        {
            Include(new PaginationParamsValidator());

            RuleFor(x => x.LanguageCode)
                .Length(2)
                .When(x => !string.IsNullOrEmpty(x.LanguageCode))
                .WithMessage("Language code must be 2 characters (e.g. 'tr', 'en')");

            RuleFor(x => x.SortBy)
                .Must(sortBy => ValidSortFields.Contains(sortBy!.ToLower()))
                .When(x => !string.IsNullOrEmpty(x.SortBy))
                .WithMessage($"SortBy must be one of: {string.Join(", ", ValidSortFields)}");

            RuleFor(x => x.SortOrder)
                .Must(sortOrder => ValidSortOrders.Contains(sortOrder!.ToLower()))
                .When(x => !string.IsNullOrEmpty(x.SortOrder))
                .WithMessage("SortOrder must be 'asc' or 'desc'");

            RuleFor(x => x.SearchTerm)
                .MaximumLength(200)
                .When(x => !string.IsNullOrEmpty(x.SearchTerm))
                .WithMessage("Search term cannot exceed 200 characters");
        }
    }
}
