using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateMusicValidator : AbstractValidator<CreateMusicDto>
    {
        public CreateMusicValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Artist)
                .NotEmpty().WithMessage("Artist is required")
                .MaximumLength(200).WithMessage("Artist cannot exceed 200 characters");

            RuleFor(x => x.Album)
                .MaximumLength(200).WithMessage("Album cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Album));

            RuleFor(x => x.Genre)
                .MaximumLength(200).WithMessage("Genre cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Genre));

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1800, 2100).WithMessage("Release year must be between 1800 and 2100")
                .When(x => x.ReleaseYear.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }

    public class UpdateMusicValidator : AbstractValidator<UpdateMusicDto>
    {
        public UpdateMusicValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Artist)
                .NotEmpty().WithMessage("Artist is required")
                .MaximumLength(200).WithMessage("Artist cannot exceed 200 characters");

            RuleFor(x => x.Album)
                .MaximumLength(200).WithMessage("Album cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Album));

            RuleFor(x => x.Genre)
                .MaximumLength(200).WithMessage("Genre cannot exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Genre));

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1800, 2100).WithMessage("Release year must be between 1800 and 2100")
                .When(x => x.ReleaseYear.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }
}
