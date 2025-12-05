using AutoMapper;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Entities.DTOs;

namespace MustafaGuler.Service.Mapping
{
    public class MapProfile : Profile
    {
        public MapProfile()
        {
            // CreateMap<Source, Destination>
            CreateMap<Article, ArticleListDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<Article, ArticleDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => "Mustafa Güler")); // Hardcoded for now

            // Allows converting DTO back to Entity
            CreateMap<ArticleListDto, Article>();

            // Also add the existing mapping for AddDto
            CreateMap<ArticleAddDto, Article>();
        }
    }
}