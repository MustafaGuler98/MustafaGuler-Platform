using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateBookValidator : AbstractValidator<CreateBookDto>
    {
        public CreateBookValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Author)
                .NotEmpty().WithMessage("Author is required")
                .MaximumLength(200).WithMessage("Author cannot exceed 200 characters");

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.PageCount)
                .GreaterThan(0).WithMessage("Page count must be greater than 0")
                .When(x => x.PageCount.HasValue);

            RuleFor(x => x.ReadingStatus)
                .IsInEnum().WithMessage("Invalid reading status");
        }
    }

    public class UpdateBookValidator : AbstractValidator<UpdateBookDto>
    {
        public UpdateBookValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Author)
                .NotEmpty().WithMessage("Author is required")
                .MaximumLength(200).WithMessage("Author cannot exceed 200 characters");

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.ReadingStatus)
                .IsInEnum().WithMessage("Invalid reading status");
        }
    }
}
