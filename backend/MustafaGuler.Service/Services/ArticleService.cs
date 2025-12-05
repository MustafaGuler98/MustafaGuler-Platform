using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Service.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IGenericRepository<Article> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public ArticleService(IGenericRepository<Article> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IDataResult<IEnumerable<Article>>> GetAllAsync()
        {
            var articles = await _repository.GetAllAsync();
            if (articles == null)
                return new ErrorDataResult<IEnumerable<Article>>("No articles found.");

            return new SuccessDataResult<IEnumerable<Article>>(articles, "Articles listed.");
        }

        public async Task<IResult> AddAsync(ArticleAddDto articleAddDto)
        {
            // (Will be replaced by FluentValidation later)
            if (string.IsNullOrEmpty(articleAddDto.Title))
            {
                return new ErrorResult("Title is required.");
            }

            // We manually map properties because we don't have AutoMapper yet.
            var article = new Article
            {
                Id = Guid.NewGuid(),
                Title = articleAddDto.Title,
                Content = articleAddDto.Content,
                LanguageCode = articleAddDto.LanguageCode,
                // CategoryId = articleAddDto.CategoryId,
                CreatedDate = DateTime.UtcNow,
                IsDeleted = false,
                ViewCount = 0,
                GroupId = Guid.NewGuid() // Temporary
            };

            await _repository.AddAsync(article);
            await _unitOfWork.CommitAsync();

            return new SuccessResult("Article added successfully.");
        }
    }
}