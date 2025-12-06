using AutoMapper;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Entities.DTOs;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Helpers;
using MustafaGuler.Core.Utilities.Results;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IGenericRepository<Article> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ArticleService(IGenericRepository<Article> repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IDataResult<IEnumerable<ArticleListDto>>> GetAllAsync(string? languageCode = null, Guid? categoryId = null)
        {
            Expression<Func<Article, bool>> filterExpression = x =>
                !x.IsDeleted
                && (string.IsNullOrEmpty(languageCode) || x.LanguageCode == languageCode)
                && (!categoryId.HasValue || x.CategoryId == categoryId);

            var articles = await _repository.GetAllAsync(
                filter: filterExpression,
                includes: new Expression<Func<Article, object>>[]
                {
                    x => x.Category,
                    x => x.User
                }
            );

            if (articles == null)
                return new ErrorDataResult<IEnumerable<ArticleListDto>>("No articles found.");
            articles = articles.OrderByDescending(x => x.CreatedDate);

            var articleDtos = _mapper.Map<IEnumerable<ArticleListDto>>(articles);
            return new SuccessDataResult<IEnumerable<ArticleListDto>>(articleDtos, "Articles listed successfully.");
        }

        public async Task<IDataResult<ArticleDetailDto>> GetBySlugAsync(string slug)
        {
            var article = await _repository.GetAsync(
                filter: x => x.Slug == slug && !x.IsDeleted,
                includes: new Expression<Func<Article, object>>[]
                {
                    x => x.Category,
                    x => x.User 
                }
            );
            if (article == null)
            {
                return new ErrorDataResult<ArticleDetailDto>("Article not found.");
            }
            var articleDetailDto = _mapper.Map<ArticleDetailDto>(article);

            var nextArticle = await GetNextArticleAsync(article);
            var prevArticle = await GetPreviousArticleAsync(article);

            articleDetailDto.NextArticle = nextArticle != null
               ? _mapper.Map<ArticleNavigationDto>(nextArticle)
               : null;
            articleDetailDto.PreviousArticle = prevArticle != null
               ? _mapper.Map<ArticleNavigationDto>(prevArticle)
               : null;

            return new SuccessDataResult<ArticleDetailDto>(articleDetailDto);
        }

        public async Task<IResult> AddAsync(ArticleAddDto articleAddDto)
        {
            if (string.IsNullOrEmpty(articleAddDto.Title))
            {
                return new ErrorResult("Title is required.");
            }

            var article = _mapper.Map<Article>(articleAddDto);

            article.Id = Guid.NewGuid();
            article.CreatedDate = DateTime.UtcNow;
            article.IsDeleted = false;
            article.ViewCount = 0;
            article.GroupId = Guid.NewGuid(); // Temp
            article.UserId = Guid.Parse("CB94223B-CCB8-4F2F-93D7-0DF96A7F3839");

            article.Slug = await GenerateUniqueSlugAsync(article.Title);

            await _repository.AddAsync(article);
            await _unitOfWork.CommitAsync();

            return new SuccessResult("Article added successfully.");
        }

 
        private async Task<string> GenerateUniqueSlugAsync(string title)
        {
            var baseSlug = SlugHelper.GenerateSlug(title);
            var slug = baseSlug;
            int counter = 1;

            while (await _repository.AnyAsync(x => x.Slug == slug))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }
        private async Task<Article?> GetNextArticleAsync(Article currentArticle)
        {
            // If dates are equal, we compare by ID to ensure consistent ordering.
            var categoryCandidates = await _repository.GetAllAsync(x =>
                x.LanguageCode == currentArticle.LanguageCode &&
                x.CategoryId == currentArticle.CategoryId &&
                !x.IsDeleted &&
                (x.CreatedDate > currentArticle.CreatedDate || (x.CreatedDate == currentArticle.CreatedDate && x.Id > currentArticle.Id))
            );

            var nextInCategory = categoryCandidates
                .OrderBy(x => x.CreatedDate)
                .ThenBy(x => x.Id)
                .FirstOrDefault();
            if (nextInCategory != null) return nextInCategory;

            // If no next article in the same category, search globally
            var globalCandidates = await _repository.GetAllAsync(x =>
                x.LanguageCode == currentArticle.LanguageCode &&
                !x.IsDeleted &&
                (x.CreatedDate > currentArticle.CreatedDate || (x.CreatedDate == currentArticle.CreatedDate && x.Id > currentArticle.Id))
            );

            return globalCandidates
                .OrderBy(x => x.CreatedDate)
                .ThenBy(x => x.Id)
                .FirstOrDefault();
        }

        private async Task<Article?> GetPreviousArticleAsync(Article currentArticle)
        {
            var categoryCandidates = await _repository.GetAllAsync(x =>
                x.LanguageCode == currentArticle.LanguageCode &&
                x.CategoryId == currentArticle.CategoryId &&
                !x.IsDeleted &&
                (x.CreatedDate < currentArticle.CreatedDate || (x.CreatedDate == currentArticle.CreatedDate && x.Id < currentArticle.Id))
            );

            var prevInCategory = categoryCandidates
                .OrderByDescending(x => x.CreatedDate)
                .ThenByDescending(x => x.Id)
                .FirstOrDefault();

            if (prevInCategory != null) return prevInCategory;

            var globalCandidates = await _repository.GetAllAsync(x =>
                x.LanguageCode == currentArticle.LanguageCode &&
                !x.IsDeleted &&
                (x.CreatedDate < currentArticle.CreatedDate || (x.CreatedDate == currentArticle.CreatedDate && x.Id < currentArticle.Id))
            );

            return globalCandidates
                .OrderByDescending(x => x.CreatedDate)
                .ThenByDescending(x => x.Id)
                .FirstOrDefault();
        }
    }
}