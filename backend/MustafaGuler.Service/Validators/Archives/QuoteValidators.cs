using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateQuoteValidator : AbstractValidator<CreateQuoteDto>
    {
        public CreateQuoteValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required")
                .MaximumLength(5000).WithMessage("Content cannot exceed 5000 characters");

            RuleFor(x => x.Author)
                .NotEmpty().WithMessage("Author is required")
                .MaximumLength(200).WithMessage("Author cannot exceed 200 characters");

            RuleFor(x => x.Source)
                .MaximumLength(300).WithMessage("Source cannot exceed 300 characters")
                .When(x => !string.IsNullOrEmpty(x.Source));
        }
    }

    public class UpdateQuoteValidator : AbstractValidator<UpdateQuoteDto>
    {
        public UpdateQuoteValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required")
                .MaximumLength(5000).WithMessage("Content cannot exceed 5000 characters");

            RuleFor(x => x.Author)
                .NotEmpty().WithMessage("Author is required")
                .MaximumLength(200).WithMessage("Author cannot exceed 200 characters");

            RuleFor(x => x.Source)
                .MaximumLength(300).WithMessage("Source cannot exceed 300 characters")
                .When(x => !string.IsNullOrEmpty(x.Source));
        }
    }
}
