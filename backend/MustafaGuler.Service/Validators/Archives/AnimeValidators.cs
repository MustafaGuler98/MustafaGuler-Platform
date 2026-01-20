using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateAnimeValidator : AbstractValidator<CreateAnimeDto>
    {
        public CreateAnimeValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Episodes)
                .GreaterThan(0).WithMessage("Episodes must be greater than 0")
                .When(x => x.Episodes.HasValue);

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1800, 2100).WithMessage("Release year must be between 1800 and 2100")
                .When(x => x.ReleaseYear.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid watch status");

            RuleFor(x => x.Studio)
                .MaximumLength(200).WithMessage("Studio cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Studio));

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }

    public class UpdateAnimeValidator : AbstractValidator<UpdateAnimeDto>
    {
        public UpdateAnimeValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Episodes)
                .GreaterThan(0).WithMessage("Episodes must be greater than 0")
                .When(x => x.Episodes.HasValue);

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1800, 2100).WithMessage("Release year must be between 1800 and 2100")
                .When(x => x.ReleaseYear.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid watch status");

            RuleFor(x => x.Studio)
                .MaximumLength(200).WithMessage("Studio cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Studio));

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }
}
