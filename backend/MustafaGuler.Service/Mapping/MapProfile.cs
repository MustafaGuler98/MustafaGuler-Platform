using AutoMapper;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.DTOs.Contact;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Entities.Archives;

namespace MustafaGuler.Service.Mapping
{
    // TO DO: Split into multiple profiles
    public class MapProfile : Profile
    {
        public MapProfile()
        {
            // CreateMap<Source, Destination>
            CreateMap<Article, ArticleListDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : "Unknown"))
                .ForMember(dest => dest.MainImage, opt => opt.MapFrom(src => src.MainImage ?? "/assets/images/default-article.png"));

            CreateMap<Article, ArticleListWithoutImageDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));

            CreateMap<Article, ArticleDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : "Unknown"))
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

            // Contact Message mappings
            CreateMap<ContactMessage, ContactMessageListDto>()
                .ForMember(dest => dest.MessagePreview, opt => opt.MapFrom(src =>
                    src.MessageBody.Length > 100 ? src.MessageBody.Substring(0, 100) + "..." : src.MessageBody));

            CreateMap<ContactMessage, ContactMessageDetailDto>();

            CreateMap<ContactMessage, SubscriberDto>();
            CreateMap<Subscriber, SubscriberDto>();

            // ARCHIVES
            CreateMap<Movie, MovieDto>();
            CreateMap<CreateMovieDto, Movie>();
            CreateMap<UpdateMovieDto, Movie>();

            CreateMap<Book, BookDto>();
            CreateMap<CreateBookDto, Book>();
            CreateMap<UpdateBookDto, Book>();

            CreateMap<Quote, QuoteDto>();
            CreateMap<CreateQuoteDto, Quote>();
            CreateMap<UpdateQuoteDto, Quote>();

            CreateMap<TvSeries, TvSeriesDto>();
            CreateMap<CreateTvSeriesDto, TvSeries>();
            CreateMap<UpdateTvSeriesDto, TvSeries>();

            CreateMap<Anime, AnimeDto>();
            CreateMap<CreateAnimeDto, Anime>();
            CreateMap<UpdateAnimeDto, Anime>();

            CreateMap<Game, GameDto>();
            CreateMap<CreateGameDto, Game>();
            CreateMap<UpdateGameDto, Game>();

            CreateMap<Music, MusicDto>();
            CreateMap<CreateMusicDto, Music>();
            CreateMap<UpdateMusicDto, Music>();

            CreateMap<TTRPG, TTRPGDto>();
            CreateMap<CreateTTRPGDto, TTRPG>();
            CreateMap<UpdateTTRPGDto, TTRPG>();

            // MINDMAP
            CreateMap<MindmapItem, MindmapItemDto>();
            CreateMap<MindmapItemAddDto, MindmapItem>();
            CreateMap<MindmapItemUpdateDto, MindmapItem>();
        }
    }
}
