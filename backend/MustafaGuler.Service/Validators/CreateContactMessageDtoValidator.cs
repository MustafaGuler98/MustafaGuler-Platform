using FluentValidation;
using MustafaGuler.Core.DTOs.Contact;

namespace MustafaGuler.Service.Validators
{
    public class CreateContactMessageDtoValidator : AbstractValidator<CreateContactMessageDto>
    {
        public CreateContactMessageDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Identity // Required")
                .MaximumLength(100).WithMessage("Identity // Too Long");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email // Required")
                .EmailAddress().WithMessage("Email // Invalid Protocol")
                .MaximumLength(150).WithMessage("Email // Too Long");

            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage("Subject // Required")
                .MaximumLength(200).WithMessage("Subject // Too Long");

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage("Message // Packet Empty")
                .MaximumLength(2000).WithMessage("Message // Buffer Overflow");
        }
    }
}
