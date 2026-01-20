using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateTTRPGValidator : AbstractValidator<CreateTTRPGDto>
    {
        public CreateTTRPGValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.System)
                .MaximumLength(200).WithMessage("System cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.System));

            RuleFor(x => x.CampaignName)
                .MaximumLength(200).WithMessage("Campaign name cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.CampaignName));

            RuleFor(x => x.SessionCount)
                .GreaterThanOrEqualTo(0).WithMessage("Session count must be greater than or equal to 0")
                .When(x => x.SessionCount.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Role)
                .IsInEnum().WithMessage("Invalid role");

            RuleFor(x => x.CampaignStatus)
                .IsInEnum().WithMessage("Invalid campaign status");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }

    public class UpdateTTRPGValidator : AbstractValidator<UpdateTTRPGDto>
    {
        public UpdateTTRPGValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.System)
                .MaximumLength(200).WithMessage("System cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.System));

            RuleFor(x => x.CampaignName)
                .MaximumLength(200).WithMessage("Campaign name cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.CampaignName));

            RuleFor(x => x.SessionCount)
                .GreaterThanOrEqualTo(0).WithMessage("Session count must be greater than or equal to 0")
                .When(x => x.SessionCount.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Role)
                .IsInEnum().WithMessage("Invalid role");

            RuleFor(x => x.CampaignStatus)
                .IsInEnum().WithMessage("Invalid campaign status");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }
}
