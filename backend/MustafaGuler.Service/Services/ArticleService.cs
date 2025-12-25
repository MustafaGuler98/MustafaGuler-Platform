using AutoMapper;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Helpers;
using MustafaGuler.Core.Utilities.Results;
using System.Linq.Expressions;

namespace MustafaGuler.Service.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IGenericRepository<Article> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public ArticleService(IGenericRepository<Article> repository, IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<Result<IEnumerable<ArticleListDto>>> GetAllAsync(string? languageCode = null, Guid? categoryId = null)
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

            if (articles == null || !articles.Any())
                return Result<IEnumerable<ArticleListDto>>.Failure(404, Messages.NoArticlesFound);

            articles = articles.OrderByDescending(x => x.CreatedDate);

            var articleDtos = _mapper.Map<IEnumerable<ArticleListDto>>(articles);

            return Result<IEnumerable<ArticleListDto>>.Success(articleDtos, 200, Messages.ArticlesListed);
        }

        public async Task<PagedResult<ArticleListDto>> GetPagedListAsync(PaginationParams paginationParams, string? languageCode = null, Guid? categoryId = null)
        {
            Expression<Func<Article, bool>> filterExpression = x =>
                !x.IsDeleted
                && (string.IsNullOrEmpty(languageCode) || x.LanguageCode == languageCode)
                && (!categoryId.HasValue || x.CategoryId == categoryId);

            var pagedEntities = await _repository.GetPagedListAsync(
                paginationParams, 
                filterExpression, 
                x => x.Category, 
                x => x.User
            );
            
            var dtos = _mapper.Map<List<ArticleListDto>>(pagedEntities.Data);

            return new PagedResult<ArticleListDto>(dtos, pagedEntities.TotalCount, pagedEntities.PageNumber, pagedEntities.PageSize);
        }

        public async Task<Result<IEnumerable<ArticleListDto>>> GetPopularAsync(int count = 9, string? languageCode = null)
        {
            Expression<Func<Article, bool>> filterExpression = x =>
                !x.IsDeleted
                && (string.IsNullOrEmpty(languageCode) || x.LanguageCode == languageCode);

            var articles = await _repository.GetAllAsync(
                filter: filterExpression,
                includes: new Expression<Func<Article, object>>[]
                {
                    x => x.Category,
                    x => x.User
                }
            );

            if (articles == null || !articles.Any())
                return Result<IEnumerable<ArticleListDto>>.Failure(404, Messages.NoArticlesFound);

            // Sort by ViewCount (desc), then by Slug (for consistent ordering when viewCount is equal)
            var popularArticles = articles
                .OrderByDescending(x => x.ViewCount)
                .ThenBy(x => x.Slug)
                .Take(count);

            var articleDtos = _mapper.Map<IEnumerable<ArticleListDto>>(popularArticles);

            return Result<IEnumerable<ArticleListDto>>.Success(articleDtos, 200, Messages.ArticlesListed);
        }

        public async Task<Result<ArticleDetailDto>> GetBySlugAsync(string slug)
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
                return Result<ArticleDetailDto>.Failure(404, Messages.ArticleNotFound);
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

            return Result<ArticleDetailDto>.Success(articleDetailDto);
        }

        public async Task<Result> AddAsync(ArticleAddDto articleAddDto)
        {
            if (string.IsNullOrEmpty(articleAddDto.Title))
            {
                return Result.Failure(400, Messages.ArticleTitleRequired);
            }

            var article = _mapper.Map<Article>(articleAddDto);

            article.Id = Guid.NewGuid();
            article.CreatedDate = DateTime.UtcNow;
            article.IsDeleted = false;
            article.ViewCount = 0;
            article.GroupId = Guid.NewGuid(); //temp

            if (_currentUserService.UserId == null)
            {
                return Result.Failure(401, "User is not authenticated (UserId not found).");
            }
            article.UserId = _currentUserService.UserId.Value;

            article.Slug = await GenerateUniqueSlugAsync(article.Title);

            await _repository.AddAsync(article);
            await _unitOfWork.CommitAsync();

            return Result.Success(201, Messages.ArticleAdded);
        }

        public async Task<Result<ArticleDetailDto>> GetByIdAsync(Guid id)
        {
            var article = await _repository.GetAsync(
                filter: x => x.Id == id && !x.IsDeleted,
                includes: new Expression<Func<Article, object>>[]
                {
                    x => x.Category,
                    x => x.User
                }
            );

            if (article == null)
            {
                return Result<ArticleDetailDto>.Failure(404, Messages.ArticleNotFound);
            }

            var articleDetailDto = _mapper.Map<ArticleDetailDto>(article);
            return Result<ArticleDetailDto>.Success(articleDetailDto);
        }

        public async Task<Result> UpdateAsync(ArticleUpdateDto articleUpdateDto)
        {
            var article = await _repository.GetByIdAsync(articleUpdateDto.Id);

            if (article == null || article.IsDeleted)
            {
                return Result.Failure(404, Messages.ArticleNotFound);
            }

            article.Title = articleUpdateDto.Title;
            article.Content = articleUpdateDto.Content;
            article.CategoryId = articleUpdateDto.CategoryId;
            article.LanguageCode = articleUpdateDto.LanguageCode;
            article.MainImage = articleUpdateDto.MainImage;
            article.UpdatedDate = DateTime.UtcNow;

            // Regenerate slug if title changed
            if (article.Slug != SlugHelper.GenerateSlug(articleUpdateDto.Title))
            {
                article.Slug = await GenerateUniqueSlugAsync(articleUpdateDto.Title);
            }

            _repository.Update(article);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, Messages.ArticleUpdated);
        }

        public async Task<Result> DeleteAsync(Guid id)
        {
            var article = await _repository.GetByIdAsync(id);

            if (article == null || article.IsDeleted)
            {
                return Result.Failure(404, Messages.ArticleNotFound);
            }

            // Soft delete
            article.IsDeleted = true;
            article.UpdatedDate = DateTime.UtcNow;

            _repository.Update(article);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, Messages.ArticleDeleted);
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
            return await _repository.GetAsync(
                filter: x =>
                    x.LanguageCode == currentArticle.LanguageCode &&
                    !x.IsDeleted &&
                    (x.CreatedDate > currentArticle.CreatedDate || (x.CreatedDate == currentArticle.CreatedDate && x.Id.CompareTo(currentArticle.Id) > 0)),
                orderBy: q => q.OrderBy(x => x.CreatedDate).ThenBy(x => x.Id)
            );
        }

        private async Task<Article?> GetPreviousArticleAsync(Article currentArticle)
        {
            return await _repository.GetAsync(
                filter: x =>
                    x.LanguageCode == currentArticle.LanguageCode &&
                    !x.IsDeleted &&
                    (x.CreatedDate < currentArticle.CreatedDate || (x.CreatedDate == currentArticle.CreatedDate && x.Id.CompareTo(currentArticle.Id) < 0)),
                orderBy: q => q.OrderByDescending(x => x.CreatedDate).ThenByDescending(x => x.Id)
            );
        }
    }
}