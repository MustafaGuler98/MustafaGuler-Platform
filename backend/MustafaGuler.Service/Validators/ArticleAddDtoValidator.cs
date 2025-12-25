using FluentValidation;
using MustafaGuler.Core.DTOs;

namespace MustafaGuler.Service.Validators
{
    public class ArticleAddDtoValidator : AbstractValidator<ArticleAddDto>
    {
        public ArticleAddDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required");

            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("CategoryId is required");

            RuleFor(x => x.LanguageCode)
                .NotEmpty().WithMessage("LanguageCode is required")
                .Length(2).WithMessage("LanguageCode must be 2 characters (e.g. 'tr', 'en')");
        }
    }
}
