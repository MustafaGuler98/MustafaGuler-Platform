using AutoMapper;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Entities.DTOs;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Helpers;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
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
                includes: x => x.Category
            );

            if (articles == null)
                return new ErrorDataResult<IEnumerable<ArticleListDto>>("No articles found.");

            var articleDtos = _mapper.Map<IEnumerable<ArticleListDto>>(articles);
            return new SuccessDataResult<IEnumerable<ArticleListDto>>(articleDtos, "Articles listed successfully.");
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
            article.GroupId = Guid.NewGuid(); // Temp logic
            article.Slug = SlugHelper.GenerateSlug(article.Title);

            await _repository.AddAsync(article);
            await _unitOfWork.CommitAsync();

            return new SuccessResult("Article added successfully.");
        }
    }
}