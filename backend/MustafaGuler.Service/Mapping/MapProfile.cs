using AutoMapper;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;

namespace MustafaGuler.Service.Mapping
{
    public class MapProfile : Profile
    {
        public MapProfile()
        {
            // CreateMap<Source, Destination>
            CreateMap<Article, ArticleListDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.MainImage, opt => opt.MapFrom(src => src.MainImage ?? "/assets/images/default-article.png"));


            CreateMap<Article, ArticleDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.MainImage, opt => opt.MapFrom(src => src.MainImage ?? "/assets/images/default-article.png"));

            // Allows converting DTO back to Entity
            CreateMap<ArticleListDto, Article>();

            // Also add the existing mapping for AddDto
            CreateMap<ArticleAddDto, Article>();

            CreateMap<Article, ArticleNavigationDto>();

            // Category mappings
            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryAddDto, Category>();
            CreateMap<CategoryUpdateDto, Category>();

            // Image mappings
            CreateMap<Image, ImageInfoDto>()
                .ForMember(dest => dest.UploadedByName, opt => opt.MapFrom(src =>
                    src.UploadedBy != null
                        ? $"{src.UploadedBy.FirstName} {src.UploadedBy.LastName}"
                        : null));

            CreateMap<ImageUpdateDto, Image>();
        }
    }
}