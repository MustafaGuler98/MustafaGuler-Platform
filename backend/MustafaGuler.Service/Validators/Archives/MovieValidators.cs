using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateMovieValidator : AbstractValidator<CreateMovieDto>
    {
        public CreateMovieValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Director)
                .NotEmpty().WithMessage("Director is required")
                .MaximumLength(200).WithMessage("Director cannot exceed 200 characters");

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1800, 2100).WithMessage("Release year must be between 1800 and 2100")
                .When(x => x.ReleaseYear.HasValue);

            RuleFor(x => x.DurationMinutes)
                .GreaterThan(0).WithMessage("Duration must be greater than 0")
                .When(x => x.DurationMinutes.HasValue);
        }
    }

    public class UpdateMovieValidator : AbstractValidator<UpdateMovieDto>
    {
        public UpdateMovieValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Director)
                .NotEmpty().WithMessage("Director is required")
                .MaximumLength(200).WithMessage("Director cannot exceed 200 characters");

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);
        }
    }
}
