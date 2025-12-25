using FluentValidation;
using MustafaGuler.Core.DTOs;

namespace MustafaGuler.Service.Validators
{
    public class ImageUpdateDtoValidator : AbstractValidator<ImageUpdateDto>
    {
        public ImageUpdateDtoValidator()
        {
            RuleFor(x => x.Title)
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

            RuleFor(x => x.Alt)
                .MaximumLength(200).WithMessage("Alt text cannot exceed 200 characters");
        }
    }
}
