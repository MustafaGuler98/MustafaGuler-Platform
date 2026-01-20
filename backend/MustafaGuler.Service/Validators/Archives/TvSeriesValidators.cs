using FluentValidation;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Service.Validators.Archives
{
    public class CreateTvSeriesValidator : AbstractValidator<CreateTvSeriesDto>
    {
        public CreateTvSeriesValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.StartYear)
                .InclusiveBetween(1800, 2100).WithMessage("Start year must be between 1800 and 2100")
                .When(x => x.StartYear.HasValue);

            RuleFor(x => x.EndYear)
                .InclusiveBetween(1800, 2100).WithMessage("End year must be between 1800 and 2100")
                .GreaterThanOrEqualTo(x => x.StartYear).WithMessage("End year must be greater than or equal to start year")
                .When(x => x.EndYear.HasValue && x.StartYear.HasValue);

            RuleFor(x => x.TotalSeasons)
                .GreaterThan(0).WithMessage("Total seasons must be greater than 0")
                .When(x => x.TotalSeasons.HasValue);

            RuleFor(x => x.TotalEpisodes)
                .GreaterThan(0).WithMessage("Total episodes must be greater than 0")
                .When(x => x.TotalEpisodes.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid watch status");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }

    public class UpdateTvSeriesValidator : AbstractValidator<UpdateTvSeriesDto>
    {
        public UpdateTvSeriesValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.StartYear)
                .InclusiveBetween(1800, 2100).WithMessage("Start year must be between 1800 and 2100")
                .When(x => x.StartYear.HasValue);

            RuleFor(x => x.EndYear)
                .InclusiveBetween(1800, 2100).WithMessage("End year must be between 1800 and 2100")
                .GreaterThanOrEqualTo(x => x.StartYear).WithMessage("End year must be greater than or equal to start year")
                .When(x => x.EndYear.HasValue && x.StartYear.HasValue);

            RuleFor(x => x.TotalSeasons)
                .GreaterThan(0).WithMessage("Total seasons must be greater than 0")
                .When(x => x.TotalSeasons.HasValue);

            RuleFor(x => x.TotalEpisodes)
                .GreaterThan(0).WithMessage("Total episodes must be greater than 0")
                .When(x => x.TotalEpisodes.HasValue);

            RuleFor(x => x.MyRating)
                .InclusiveBetween(1, 100).WithMessage("Rating must be between 1 and 100")
                .When(x => x.MyRating.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid watch status");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }
}
