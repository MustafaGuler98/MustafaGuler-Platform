using FluentValidation;
using MustafaGuler.Core.Parameters;

namespace MustafaGuler.Service.Validators
{
    public class ImageQueryParamsValidator : AbstractValidator<ImageQueryParams>
    {
        public ImageQueryParamsValidator()
        {
            Include(new PaginationParamsValidator());

            RuleFor(x => x.SearchTerm)
                .MaximumLength(200)
                .When(x => !string.IsNullOrEmpty(x.SearchTerm))
                .WithMessage("Search term cannot exceed 200 characters");
        }
    }
}
