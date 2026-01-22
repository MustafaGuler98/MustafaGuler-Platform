using AutoMapper;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Helpers;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IGenericRepository<Category> _repository;
        private readonly IGenericRepository<Article> _articleRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        private const string OtherCategoryName = "Other";
        private const string OtherCategorySlug = "other";

        public CategoryService(
            IGenericRepository<Category> repository,
            IGenericRepository<Article> articleRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _repository = repository;
            _articleRepository = articleRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<IEnumerable<CategoryDto>>> GetAllAsync()
        {
            var categories = await _repository.GetAllAsync();
            var sortedCategories = categories.OrderBy(c => c.Name);
            var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(sortedCategories);
            return Result<IEnumerable<CategoryDto>>.Success(categoryDtos);
        }

        public async Task<Result<IEnumerable<CategoryDto>>> GetAllActiveAsync()
        {
            var categories = await _repository.GetAllAsync();

            // Get categories that have at least one active article
            var activeCategoryIds = (await _articleRepository.GetProjectedListAsync(x => x.CategoryId, x => !x.IsDeleted)).Distinct().ToHashSet();

            var activeCategories = categories.Where(c => activeCategoryIds.Contains(c.Id)).OrderBy(c => c.Name);

            var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(activeCategories);
            return Result<IEnumerable<CategoryDto>>.Success(categoryDtos);
        }

        public async Task<Result<CategoryDto>> GetByIdAsync(Guid id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
            {
                return Result<CategoryDto>.Failure(404, Messages.CategoryNotFound);
            }
            var categoryDto = _mapper.Map<CategoryDto>(category);
            return Result<CategoryDto>.Success(categoryDto);
        }

        public async Task<Result<CategoryDto>> GetBySlugAsync(string slug)
        {
            var category = await _repository.GetAsync(c => c.Slug == slug);
            if (category == null)
            {
                return Result<CategoryDto>.Failure(404, Messages.CategoryNotFound);
            }
            var categoryDto = _mapper.Map<CategoryDto>(category);
            return Result<CategoryDto>.Success(categoryDto);
        }

        public async Task<Result> AddAsync(CategoryAddDto categoryAddDto)
        {
            var category = _mapper.Map<Category>(categoryAddDto);
            category.Id = Guid.NewGuid();
            category.Slug = await GenerateUniqueSlugAsync(categoryAddDto.Name);
            category.CreatedDate = DateTime.UtcNow;

            await _repository.AddAsync(category);
            await _unitOfWork.CommitAsync();

            return Result.Success(201, Messages.CategoryAdded);
        }

        public async Task<Result> UpdateAsync(CategoryUpdateDto categoryUpdateDto)
        {
            var category = await _repository.GetByIdAsync(categoryUpdateDto.Id);
            if (category == null)
            {
                return Result.Failure(404, Messages.CategoryNotFound);
            }

            category.Name = categoryUpdateDto.Name;
            category.Description = categoryUpdateDto.Description ?? category.Description;
            category.ParentId = categoryUpdateDto.ParentId;

            if (category.Slug != SlugHelper.GenerateSlug(categoryUpdateDto.Name))
            {
                category.Slug = await GenerateUniqueSlugAsync(categoryUpdateDto.Name, category.Id);
            }
            category.UpdatedDate = DateTime.UtcNow;

            _repository.Update(category);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, Messages.CategoryUpdated);
        }

        public async Task<Result> DeleteAsync(Guid id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
            {
                return Result.Failure(404, Messages.CategoryNotFound);
            }

            // Prevent deleting the "Other" category
            if (category.Slug == OtherCategorySlug)
            {
                return Result.Failure(400, Messages.CannotDeleteOtherCategory);
            }

            var otherCategory = await GetOrCreateOtherCategoryAsync();

            // When a category is deleted, reassign its articles to the "Other" category
            var articles = await _articleRepository.GetAllAsync(a => a.CategoryId == id && !a.IsDeleted);
            foreach (var article in articles)
            {
                article.CategoryId = otherCategory.Id;
                article.UpdatedDate = DateTime.UtcNow;
                _articleRepository.Update(article);
            }

            _repository.Remove(category);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, Messages.CategoryDeleted);
        }

        private async Task<Category> GetOrCreateOtherCategoryAsync()
        {
            var otherCategory = await _repository.GetAsync(c => c.Slug == OtherCategorySlug);

            if (otherCategory == null)
            {
                otherCategory = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = OtherCategoryName,
                    Slug = OtherCategorySlug,
                    Description = "Default category for uncategorized articles",
                    CreatedDate = DateTime.UtcNow
                };
                await _repository.AddAsync(otherCategory);
            }

            return otherCategory;
        }

        private async Task<string> GenerateUniqueSlugAsync(string title, Guid? excludeId = null)
        {
            var baseSlug = SlugHelper.GenerateSlug(title);
            var slug = baseSlug;
            int counter = 1;

            while (await _repository.AnyAsync(x => x.Slug == slug && (!excludeId.HasValue || x.Id != excludeId.Value)))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }
            return slug;
        }
    }
}
