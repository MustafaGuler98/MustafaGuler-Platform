using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateGameValidator : AbstractValidator<CreateGameDto>
    {
        public CreateGameValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Platform)
                .MaximumLength(200).WithMessage("Platform cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Platform));

            RuleFor(x => x.Developer)
                .MaximumLength(200).WithMessage("Developer cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Developer));

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1950, 2100).WithMessage("Release year must be between 1950 and 2100")
                .When(x => x.ReleaseYear.HasValue);

            RuleFor(x => x.PlaytimeHours)
                .GreaterThan(0).WithMessage("Playtime must be greater than 0")
                .When(x => x.PlaytimeHours.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid game status");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }

    public class UpdateGameValidator : AbstractValidator<UpdateGameDto>
    {
        public UpdateGameValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Platform)
                .MaximumLength(200).WithMessage("Platform cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Platform));

            RuleFor(x => x.Developer)
                .MaximumLength(200).WithMessage("Developer cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Developer));

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1950, 2100).WithMessage("Release year must be between 1950 and 2100")
                .When(x => x.ReleaseYear.HasValue);

            RuleFor(x => x.PlaytimeHours)
                .GreaterThan(0).WithMessage("Playtime must be greater than 0")
                .When(x => x.PlaytimeHours.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid game status");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }
}
