using FluentValidation;
using MustafaGuler.Core.DTOs;

namespace MustafaGuler.Service.Validators
{
    public class ArticleUpdateDtoValidator : AbstractValidator<ArticleUpdateDto>
    {
        public ArticleUpdateDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required");

            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("CategoryId is required");

            RuleFor(x => x.LanguageCode)
                .NotEmpty().WithMessage("LanguageCode is required")
                .Length(2).WithMessage("LanguageCode must be 2 characters");
        }
    }
}
