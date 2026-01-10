using FluentValidation;
using MustafaGuler.Core.Parameters;

namespace MustafaGuler.Service.Validators
{
    // Base validator for pagination parameters.
    
    public class PaginationParamsValidator : AbstractValidator<PaginationParams>
    {
        public const int MaxPageSize = 50;

        public PaginationParamsValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThanOrEqualTo(1)
                .WithMessage("Page number must be at least 1");

            RuleFor(x => x.PageSize)
                .InclusiveBetween(1, MaxPageSize)
                .WithMessage($"Page size must be between 1 and {MaxPageSize}");
        }
    }
}
