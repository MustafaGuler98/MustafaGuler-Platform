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

            // Allows converting DTO back to Entity
            CreateMap<ArticleListDto, Article>();

            // Also add the existing mapping for AddDto
            CreateMap<ArticleAddDto, Article>();
        }
    }
}