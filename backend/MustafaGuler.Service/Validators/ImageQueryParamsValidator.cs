using FluentValidation;
using MustafaGuler.Core.Parameters;

namespace MustafaGuler.Service.Validators
{
    public class ImageQueryParamsValidator : AbstractValidator<ImageQueryParams>
    {
        public ImageQueryParamsValidator()
        {
            Include(new PaginationParamsValidator());

            RuleFor(x => x.Search)
                .MaximumLength(200)
                .When(x => !string.IsNullOrEmpty(x.Search))
                .WithMessage("Search term cannot exceed 200 characters");
        }
    }
}
