using AutoMapper;
using Moq;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

namespace MustafaGuler.Service.Tests
{
    public class CategoryServiceTests
    {
        private readonly Mock<IGenericRepository<Category>> _mockCategoryRepo;
        private readonly Mock<IGenericRepository<Article>> _mockArticleRepo;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IMapper> _mockMapper;
        private readonly CategoryService _categoryService;

        private readonly Guid _testCategoryId = Guid.NewGuid();
        private readonly Category _testCategory;
        private readonly CategoryDto _testCategoryDto;

        private readonly Guid _otherCategoryId = Guid.NewGuid();
        private readonly Category _otherCategory;

        public CategoryServiceTests()
        {
            _mockCategoryRepo = new Mock<IGenericRepository<Category>>();
            _mockArticleRepo = new Mock<IGenericRepository<Article>>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();

            _testCategory = new Category
            {
                Id = _testCategoryId,
                Name = "Technology",
                Slug = "technology",
                Description = "Tech articles"
            };

            _testCategoryDto = new CategoryDto
            {
                Id = _testCategoryId,
                Name = "Technology",
                Slug = "technology"
            };

            _otherCategory = new Category
            {
                Id = _otherCategoryId,
                Name = "Other",
                Slug = "other",
                Description = "Default category"
            };

            _categoryService = new CategoryService(
                _mockCategoryRepo.Object,
                _mockArticleRepo.Object,
                _mockUnitOfWork.Object,
                _mockMapper.Object);
        }

        #region GetAllAsync Tests

        [Fact]
        public async Task GetAllAsync_WhenCategoriesExist_ReturnsCategoryList()
        {
            // Arrange
            var categories = new List<Category> { _testCategory, _otherCategory };
            var categoryDtos = new List<CategoryDto> { _testCategoryDto };

            _mockCategoryRepo.Setup(x => x.GetAllAsync())
                             .ReturnsAsync(categories);
            _mockMapper.Setup(m => m.Map<IEnumerable<CategoryDto>>(categories))
                       .Returns(categoryDtos);

            // Act
            var result = await _categoryService.GetAllAsync();

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
        }

        [Fact]
        public async Task GetAllAsync_WhenNoCategoriesExist_ReturnsEmptyList()
        {
            // Arrange
            _mockCategoryRepo.Setup(x => x.GetAllAsync())
                             .ReturnsAsync(new List<Category>());
            _mockMapper.Setup(m => m.Map<IEnumerable<CategoryDto>>(It.IsAny<IEnumerable<Category>>()))
                       .Returns(new List<CategoryDto>());

            // Act
            var result = await _categoryService.GetAllAsync();

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
        }

        #endregion

        #region GetByIdAsync Tests

        [Fact]
        public async Task GetByIdAsync_WhenCategoryExists_ReturnsCategoryDto()
        {
            // Arrange
            _mockCategoryRepo.Setup(x => x.GetByIdAsync(_testCategoryId))
                             .ReturnsAsync(_testCategory);
            _mockMapper.Setup(m => m.Map<CategoryDto>(_testCategory))
                       .Returns(_testCategoryDto);

            // Act
            var result = await _categoryService.GetByIdAsync(_testCategoryId);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(_testCategoryId, result.Data.Id);
        }

        [Fact]
        public async Task GetByIdAsync_WhenCategoryNotFound_Returns404()
        {
            // Arrange
            _mockCategoryRepo.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
                             .ReturnsAsync((Category?)null);

            // Act
            var result = await _categoryService.GetByIdAsync(Guid.NewGuid());

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(Messages.CategoryNotFound, result.Message);
        }

        #endregion

        #region Helper Methods

        private void SetupMapperForAddAsync(CategoryAddDto dto)
        {
            _mockMapper.Setup(m => m.Map<Category>(dto))
                       .Returns(new Category { Name = dto.Name });
        }

        #endregion

        #region AddAsync Tests

        [Fact]
        public async Task AddAsync_WhenValidCategory_AddsSuccessfully()
        {
            // Arrange
            var addDto = new CategoryAddDto
            {
                Name = TestConstants.Category.NewCategoryName,
                Description = TestConstants.Category.NewCategoryDesc
            };

            SetupMapperForAddAsync(addDto);

            // Act
            var result = await _categoryService.AddAsync(addDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(201, result.StatusCode);
            _mockCategoryRepo.Verify(x => x.AddAsync(It.IsAny<Category>()), Times.Once);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WhenCalled_GeneratesSlugFromName()
        {
            // Arrange
            var addDto = new CategoryAddDto
            {
                Name = TestConstants.Category.YazilimName,
                Description = TestConstants.Category.YazilimDesc
            };

            SetupMapperForAddAsync(addDto);

            Category? capturedCategory = null;
            _mockCategoryRepo.Setup(x => x.AddAsync(It.IsAny<Category>()))
                             .Callback<Category>(c => capturedCategory = c)
                             .Returns(Task.CompletedTask);

            // Act
            await _categoryService.AddAsync(addDto);

            // Assert
            Assert.NotNull(capturedCategory);
            Assert.Equal(TestConstants.Category.YazilimSlug, capturedCategory.Slug);
        }

        [Fact]
        public async Task AddAsync_WhenCalled_SetsCreatedDate()
        {
            // Arrange
            var addDto = new CategoryAddDto { Name = "Test" };
            var beforeAdd = DateTime.UtcNow;

            SetupMapperForAddAsync(addDto);

            Category? capturedCategory = null;
            _mockCategoryRepo.Setup(x => x.AddAsync(It.IsAny<Category>()))
                             .Callback<Category>(c => capturedCategory = c)
                             .Returns(Task.CompletedTask);

            // Act
            var result = await _categoryService.AddAsync(addDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(capturedCategory);
            Assert.True(capturedCategory.CreatedDate >= beforeAdd);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WhenCalled_GeneratesNewGuid()
        {
            // Arrange
            var addDto = new CategoryAddDto { Name = "Test" };

            SetupMapperForAddAsync(addDto);

            Category? capturedCategory = null;
            _mockCategoryRepo.Setup(x => x.AddAsync(It.IsAny<Category>()))
                             .Callback<Category>(c => capturedCategory = c)
                             .Returns(Task.CompletedTask);

            // Act
            var result = await _categoryService.AddAsync(addDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(capturedCategory);
            Assert.NotEqual(Guid.Empty, capturedCategory.Id);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        #endregion

        #region UpdateAsync Tests

        [Fact]
        public async Task UpdateAsync_WhenCategoryExists_UpdatesSuccessfully()
        {
            // Arrange
            var updateDto = new CategoryUpdateDto
            {
                Id = _testCategoryId,
                Name = "Updated Technology",
                Description = "Updated description"
            };

            _mockCategoryRepo.Setup(x => x.GetByIdAsync(_testCategoryId))
                             .ReturnsAsync(_testCategory);

            // Act
            var result = await _categoryService.UpdateAsync(updateDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            _mockCategoryRepo.Verify(x => x.Update(It.IsAny<Category>()), Times.Once);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WhenCategoryNotFound_Returns404()
        {
            // Arrange
            var updateDto = new CategoryUpdateDto { Id = Guid.NewGuid(), Name = "Any" };

            _mockCategoryRepo.Setup(x => x.GetByIdAsync(updateDto.Id))
                             .ReturnsAsync((Category?)null);

            // Act
            var result = await _categoryService.UpdateAsync(updateDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(Messages.CategoryNotFound, result.Message);
        }

        [Fact]
        public async Task UpdateAsync_WhenNameChanged_RegeneratesSlug()
        {
            // Arrange
            var updateDto = new CategoryUpdateDto
            {
                Id = _testCategoryId,
                Name = "New Category Name"
            };

            _mockCategoryRepo.Setup(x => x.GetByIdAsync(_testCategoryId))
                             .ReturnsAsync(_testCategory);

            // Act
            // Act
            var result = await _categoryService.UpdateAsync(updateDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("new-category-name", _testCategory.Slug);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WhenUpdated_SetsUpdatedDate()
        {
            // Arrange
            var updateDto = new CategoryUpdateDto
            {
                Id = _testCategoryId,
                Name = "Updated"
            };
            var beforeUpdate = DateTime.UtcNow;

            _mockCategoryRepo.Setup(x => x.GetByIdAsync(_testCategoryId))
                             .ReturnsAsync(_testCategory);

            // Act
            var result = await _categoryService.UpdateAsync(updateDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(_testCategory.UpdatedDate);
            Assert.True(_testCategory.UpdatedDate >= beforeUpdate);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        #endregion

        #region DeleteAsync Tests

        [Fact]
        public async Task DeleteAsync_WhenCategoryExists_DeletesSuccessfully()
        {
            // Arrange
            _mockCategoryRepo.Setup(x => x.GetByIdAsync(_testCategoryId))
                             .ReturnsAsync(_testCategory);
            _mockCategoryRepo.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Category, bool>>>()))
                             .ReturnsAsync(_otherCategory);
            _mockArticleRepo.Setup(x => x.GetAllAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                            .ReturnsAsync(new List<Article>());

            // Act
            var result = await _categoryService.DeleteAsync(_testCategoryId);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            _mockCategoryRepo.Verify(x => x.Remove(_testCategory), Times.Once);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WhenCategoryNotFound_Returns404()
        {
            // Arrange
            _mockCategoryRepo.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
                             .ReturnsAsync((Category?)null);

            // Act
            var result = await _categoryService.DeleteAsync(Guid.NewGuid());

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(Messages.CategoryNotFound, result.Message);
        }

        [Fact]
        public async Task DeleteAsync_WhenDeletingOtherCategory_Returns400()
        {
            // Arrange
            _mockCategoryRepo.Setup(x => x.GetByIdAsync(_otherCategoryId))
                             .ReturnsAsync(_otherCategory);

            // Act
            var result = await _categoryService.DeleteAsync(_otherCategoryId);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal(Messages.CannotDeleteOtherCategory, result.Message);
        }

        [Fact]
        public async Task DeleteAsync_WhenCategoryHasArticles_ReassignsToOther()
        {
            // Arrange
            var article = new Article
            {
                Id = Guid.NewGuid(),
                Title = "Test Article",
                CategoryId = _testCategoryId
            };

            _mockCategoryRepo.Setup(x => x.GetByIdAsync(_testCategoryId))
                             .ReturnsAsync(_testCategory);
            _mockCategoryRepo.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Category, bool>>>()))
                             .ReturnsAsync(_otherCategory);
            _mockArticleRepo.Setup(x => x.GetAllAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                            .ReturnsAsync(new List<Article> { article });

            // Act
            await _categoryService.DeleteAsync(_testCategoryId);

            // Assert - Article should be reassigned to Other category
            Assert.Equal(_otherCategoryId, article.CategoryId);
            _mockArticleRepo.Verify(x => x.Update(article), Times.Once);
        }

        #endregion
    }
}
