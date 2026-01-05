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
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

namespace MustafaGuler.Service.Tests
{
    public class ArticleServiceTests
    {
        private readonly Mock<IGenericRepository<Article>> _mockRepo;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;
        private readonly ArticleService _articleService;

        private readonly Guid _testArticleId = Guid.NewGuid();
        private readonly Guid _testCategoryId = Guid.NewGuid();
        private readonly Article _testArticle;
        private readonly ArticleDetailDto _testArticleDetailDto;

        public ArticleServiceTests()
        {
            _mockRepo = new Mock<IGenericRepository<Article>>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();
            _mockCurrentUserService = new Mock<ICurrentUserService>();

            _testArticle = new Article
            {
                Id = _testArticleId,
                Title = TestConstants.Article.TestTitle,
                Content = TestConstants.Article.TestContent,
                Slug = TestConstants.Article.TestSlug,
                CategoryId = _testCategoryId,
                IsDeleted = false,
                CreatedDate = DateTime.UtcNow
            };

            _testArticleDetailDto = new ArticleDetailDto
            {
                Id = _testArticleId,
                Title = TestConstants.Article.TestTitle,
                Content = TestConstants.Article.TestContent,
                Slug = TestConstants.Article.TestSlug
            };

            _articleService = new ArticleService(_mockRepo.Object, _mockUnitOfWork.Object, _mockMapper.Object, _mockCurrentUserService.Object);
        }

        #region AddAsync Tests

        [Fact]
        public async Task AddAsync_WhenSlugExistsInDb_AppendsCounterToSlug()
        {
            var articleDto = new ArticleAddDto { Title = TestConstants.Article.TestTitle, Content = TestConstants.Article.TestContent };
            var articleEntity = new Article { Title = TestConstants.Article.TestTitle };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);
            _mockCurrentUserService.Setup(x => x.UserId).Returns(Guid.NewGuid());

            // First check: "test-article" -> Exists (True)
            // Second check: "test-article-1" -> Does not exist (False)
            _mockRepo.SetupSequence(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(true)  
                     .ReturnsAsync(false);

            var result = await _articleService.AddAsync(articleDto);

            Assert.Equal(TestConstants.Article.TestSlugCounter, articleEntity.Slug);

            _mockRepo.Verify(x => x.AddAsync(It.IsAny<Article>()), Times.Once);

            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WhenTitleIsEmpty_ReturnsErrorResult()
        {
            var articleDto = new ArticleAddDto { Title = "" };

            var result = await _articleService.AddAsync(articleDto);

            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.ArticleTitleRequired, result.Message);

            _mockRepo.Verify(x => x.AddAsync(It.IsAny<Article>()), Times.Never);
        }

        [Fact]
        public async Task AddAsync_WhenTitleIsNull_ReturnsErrorResult()
        {
            var articleDto = new ArticleAddDto { Title = null! };

            var result = await _articleService.AddAsync(articleDto);

            Assert.False(result.IsSuccess);
            _mockRepo.Verify(x => x.AddAsync(It.IsAny<Article>()), Times.Never);
        }

        [Fact]
        public async Task AddAsync_WhenValidArticle_SetsUserId()
        {
            var userId = Guid.NewGuid();
            var articleDto = new ArticleAddDto { Title = "Test", Content = "Content" };
            var articleEntity = new Article { Title = "Test" };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);
            _mockCurrentUserService.Setup(x => x.UserId).Returns(userId);
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(false);

            // Act
            var result = await _articleService.AddAsync(articleDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(201, result.StatusCode);
            Assert.Equal(userId, articleEntity.UserId);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        #endregion

        #region GetBySlugAsync Tests

        [Fact]
        public async Task GetBySlugAsync_WhenArticleExists_ReturnsArticleDetailDto()
        {
            // Arrange
            _mockRepo.Setup(x => x.GetAsync(
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Expression<Func<Article, object?>>[]>()))
                .ReturnsAsync(_testArticle);

            _mockMapper.Setup(m => m.Map<ArticleDetailDto>(_testArticle))
                       .Returns(_testArticleDetailDto);

            // Act
            var result = await _articleService.GetBySlugAsync("test-article");

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal("test-article", result.Data.Slug);
        }

        [Fact]
        public async Task GetBySlugAsync_WhenArticleNotFound_Returns404()
        {
            // Arrange
            _mockRepo.Setup(x => x.GetAsync(
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Expression<Func<Article, object?>>[]>()))
                .ReturnsAsync((Article?)null);

            // Act
            var result = await _articleService.GetBySlugAsync("non-existent-slug");

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(Messages.ArticleNotFound, result.Message);
        }

        [Fact]
        public async Task GetBySlugAsync_WhenArticleIsDeleted_Returns404()
        {
            // Arrange - GetAsync with IsDeleted check in filter will return null for deleted articles
            _mockRepo.Setup(x => x.GetAsync(
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Expression<Func<Article, object?>>[]>()))
                .ReturnsAsync((Article?)null);

            // Act
            var result = await _articleService.GetBySlugAsync("deleted-article");

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
        }

        #endregion

        #region UpdateAsync Tests

        [Fact]
        public async Task UpdateAsync_WhenArticleExists_UpdatesSuccessfully()
        {
            // Arrange
            var updateDto = new ArticleUpdateDto
            {
                Id = _testArticleId,
                Title = "Test Article",
                Content = "Updated Content",
                CategoryId = _testCategoryId,
                LanguageCode = "en"
            };

            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(_testArticle);

            // Act
            var result = await _articleService.UpdateAsync(updateDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            _mockRepo.Verify(x => x.Update(It.IsAny<Article>()), Times.Once);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WhenArticleNotFound_Returns404()
        {
            // Arrange
            var updateDto = new ArticleUpdateDto { Id = Guid.NewGuid(), Title = "Any" };
            
            _mockRepo.Setup(x => x.GetByIdAsync(updateDto.Id))
                     .ReturnsAsync((Article?)null);

            // Act
            var result = await _articleService.UpdateAsync(updateDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(Messages.ArticleNotFound, result.Message);
            _mockRepo.Verify(x => x.Update(It.IsAny<Article>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_WhenArticleIsDeleted_Returns404()
        {
            // Arrange
            var deletedArticle = new Article
            {
                Id = _testArticleId,
                Title = "Deleted",
                IsDeleted = true
            };
            var updateDto = new ArticleUpdateDto { Id = _testArticleId, Title = "Any" };
            
            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(deletedArticle);

            // Act
            var result = await _articleService.UpdateAsync(updateDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task UpdateAsync_WhenTitleChanges_RegeneratesSlug()
        {
            // Arrange
            var updateDto = new ArticleUpdateDto
            {
                Id = _testArticleId,
                Title = "New Different Title",
                Content = "Content",
                CategoryId = _testCategoryId,
                LanguageCode = "en"
            };

            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(_testArticle);
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(false);

            // Act
            var result = await _articleService.UpdateAsync(updateDto);

            // Assert - Slug should change from "test-article" to something new
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            Assert.NotEqual("test-article", _testArticle.Slug);
            Assert.Contains("new-different-title", _testArticle.Slug);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        #endregion

        #region DeleteAsync Tests

        [Fact]
        public async Task DeleteAsync_WhenArticleExists_PerformsSoftDelete()
        {
            // Arrange
            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(_testArticle);

            // Act
            var result = await _articleService.DeleteAsync(_testArticleId);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.True(_testArticle.IsDeleted);
            Assert.NotNull(_testArticle.UpdatedDate);
            _mockRepo.Verify(x => x.Update(_testArticle), Times.Once);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WhenArticleNotFound_Returns404()
        {
            // Arrange
            var nonExistentId = Guid.NewGuid();
            _mockRepo.Setup(x => x.GetByIdAsync(nonExistentId))
                     .ReturnsAsync((Article?)null);

            // Act
            var result = await _articleService.DeleteAsync(nonExistentId);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(Messages.ArticleNotFound, result.Message);
        }

        [Fact]
        public async Task DeleteAsync_WhenArticleAlreadyDeleted_Returns404()
        {
            // Arrange
            var alreadyDeletedArticle = new Article
            {
                Id = _testArticleId,
                Title = "Deleted",
                IsDeleted = true
            };
            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(alreadyDeletedArticle);

            // Act
            var result = await _articleService.DeleteAsync(_testArticleId);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task DeleteAsync_WhenSuccessful_SetsUpdatedDate()
        {
            // Arrange
            var beforeDelete = DateTime.UtcNow;
            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(_testArticle);

            // Act
            var result = await _articleService.DeleteAsync(_testArticleId);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            Assert.NotNull(_testArticle.UpdatedDate);
            Assert.True(_testArticle.UpdatedDate >= beforeDelete);
            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        #endregion

        #region GetPagedListAsync Tests

        [Fact]
        public async Task GetPagedListAsync_WhenNoArticles_ReturnsEmptyPage()
        {
            // Arrange
            var paginationParams = new PaginationParams 
            { 
                PageNumber = TestConstants.Pagination.DefaultPageNumber, 
                PageSize = TestConstants.Pagination.DefaultPageSize 
            };

            _mockRepo.Setup(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()))
                .ReturnsAsync(new PagedResult<Article>(new List<Article>(), 0, 1, 10));

            _mockMapper.Setup(m => m.Map<List<ArticleListDto>>(It.IsAny<List<Article>>()))
                       .Returns(new List<ArticleListDto>());

            // Act
            var result = await _articleService.GetPagedListAsync(paginationParams);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result.Data);
            Assert.Equal(0, result.TotalCount);
        }

        [Fact]
        public async Task GetPagedListAsync_WhenSinglePage_ReturnsAllArticles()
        {
            // Arrange
            var paginationParams = new PaginationParams { PageNumber = 1, PageSize = 10 };
            var articles = new List<Article> { _testArticle };
            var pagedResult = new PagedResult<Article>(articles, 1, 1, 10);

            _mockRepo.Setup(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()))
                .ReturnsAsync(pagedResult);

            _mockMapper.Setup(m => m.Map<List<ArticleListDto>>(It.IsAny<List<Article>>()))
                       .Returns(new List<ArticleListDto> { new ArticleListDto { Slug = TestConstants.Article.TestSlug } });

            // Act
            var result = await _articleService.GetPagedListAsync(paginationParams);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Data);
            Assert.Equal(1, result.TotalCount);
            Assert.Equal(1, result.PageNumber);
            Assert.Equal(10, result.PageSize);
        }

        [Fact]
        public async Task GetPagedListAsync_WhenMultiplePages_ReturnsSecondPageCorrectly()
        {
            // Arrange
            var paginationParams = new PaginationParams { PageNumber = 2, PageSize = TestConstants.Pagination.SmallPageSize };
            var articles = new List<Article> 
            { 
                new Article { Id = Guid.NewGuid(), Title = "Article 6", Slug = "article-6" }
            };
            var pagedResult = new PagedResult<Article>(articles, 10, 2, TestConstants.Pagination.SmallPageSize);

            _mockRepo.Setup(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()))
                .ReturnsAsync(pagedResult);

            _mockMapper.Setup(m => m.Map<List<ArticleListDto>>(It.IsAny<List<Article>>()))
                       .Returns(new List<ArticleListDto> { new ArticleListDto { Slug = "article-6" } });

            // Act
            var result = await _articleService.GetPagedListAsync(paginationParams);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Data);
            Assert.Equal(10, result.TotalCount);
            Assert.Equal(2, result.PageNumber);
            Assert.Equal(TestConstants.Pagination.SmallPageSize, result.PageSize);
        }

        [Fact]
        public async Task GetPagedListAsync_WithLanguageFilter_ReturnsOnlyTurkishArticles()
        {
            // Arrange
            var paginationParams = new PaginationParams();
            var articles = new List<Article> 
            { 
                new Article { Id = Guid.NewGuid(), Title = "Türkçe Makale", Slug = "turkce-makale", LanguageCode = TestConstants.Language.Turkish }
            };
            var pagedResult = new PagedResult<Article>(articles, 1, 1, 10);

            _mockRepo.Setup(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()))
                .ReturnsAsync(pagedResult);

            _mockMapper.Setup(m => m.Map<List<ArticleListDto>>(It.IsAny<List<Article>>()))
                       .Returns(new List<ArticleListDto> { new ArticleListDto { Slug = "turkce-makale" } });

            // Act
            var result = await _articleService.GetPagedListAsync(paginationParams, TestConstants.Language.Turkish);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Data);
            _mockRepo.Verify(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.Is<Expression<Func<Article, bool>>>(expr => expr != null),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()), Times.Once);
        }

        [Fact]
        public async Task GetPagedListAsync_WithCategoryFilter_FiltersCorrectly()
        {
            // Arrange
            var paginationParams = new PaginationParams();
            var categoryId = Guid.NewGuid();
            var articles = new List<Article> 
            { 
                new Article { Id = Guid.NewGuid(), Title = "Backend Article", Slug = "backend-article", CategoryId = categoryId }
            };
            var pagedResult = new PagedResult<Article>(articles, 1, 1, 10);

            _mockRepo.Setup(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()))
                .ReturnsAsync(pagedResult);

            _mockMapper.Setup(m => m.Map<List<ArticleListDto>>(It.IsAny<List<Article>>()))
                       .Returns(new List<ArticleListDto> { new ArticleListDto { Slug = "backend-article" } });

            // Act
            var result = await _articleService.GetPagedListAsync(paginationParams, null, categoryId);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Data);
            _mockRepo.Verify(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.Is<Expression<Func<Article, bool>>>(expr => expr != null),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()), Times.Once);
        }

        [Fact]
        public async Task GetPagedListAsync_WithBothFilters_CombinesFiltersCorrectly()
        {
            // Arrange
            var paginationParams = new PaginationParams();
            var categoryId = Guid.NewGuid();
            var articles = new List<Article> 
            { 
                new Article 
                { 
                    Id = Guid.NewGuid(), 
                    Title = "Türkçe Backend", 
                    Slug = "turkce-backend", 
                    LanguageCode = TestConstants.Language.Turkish,
                    CategoryId = categoryId
                }
            };
            var pagedResult = new PagedResult<Article>(articles, 1, 1, 10);

            _mockRepo.Setup(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()))
                .ReturnsAsync(pagedResult);

            _mockMapper.Setup(m => m.Map<List<ArticleListDto>>(It.IsAny<List<Article>>()))
                       .Returns(new List<ArticleListDto> { new ArticleListDto { Slug = "turkce-backend" } });

            // Act
            var result = await _articleService.GetPagedListAsync(paginationParams, TestConstants.Language.Turkish, categoryId);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Data);
            Assert.Equal("turkce-backend", result.Data[0].Slug);
        }

        #endregion

        #region Edge Case Tests

        [Fact]
        public async Task AddAsync_WhenTitleContainsSqlChars_SlugHelperSanitizesInput()
        {
            // Arrange
            // NOTE: This tests SlugHelper string sanitization, NOT database SQL injection protection.
            // EF Core handles SQL injection via parameterization. This only validates slug generation.
            var articleDto = new ArticleAddDto 
            { 
                Title = TestConstants.EdgeCase.SqlInjectionTitle, // "Test'; DROP TABLE Articles--"
                Content = "Content" 
            };
            var articleEntity = new Article { Title = articleDto.Title };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);
            _mockCurrentUserService.Setup(x => x.UserId).Returns(Guid.NewGuid());
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(false);

            // Act
            var result = await _articleService.AddAsync(articleDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Contains(TestConstants.EdgeCase.ExpectedSqlSlug, articleEntity.Slug); // Should be "test-drop-table"
            Assert.DoesNotContain("'", articleEntity.Slug);
            Assert.DoesNotContain(";", articleEntity.Slug);
        }

        [Fact]
        public async Task AddAsync_WhenContentContainsHtmlTags_PreservesContent()
        {
            // Arrange
            // ⚠️ SECURITY WARNING: Backend does NOT sanitize HTML/XSS.
            // This is a DELIBERATE design decision. Frontend MUST handle sanitization.
            // This test verifies that backend preserves content as-is for storage.
            var articleDto = new ArticleAddDto 
            { 
                Title = "Test Article",
                Content = TestConstants.EdgeCase.XssContent // "<script>alert('xss')</script>"
            };
            var articleEntity = new Article { Title = articleDto.Title, Content = articleDto.Content };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);
            _mockCurrentUserService.Setup(x => x.UserId).Returns(Guid.NewGuid());
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(false);

            // Act
            var result = await _articleService.AddAsync(articleDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(TestConstants.EdgeCase.XssContent, articleEntity.Content); // Not sanitized
        }

        [Fact]
        public async Task AddAsync_WhenTitleContainsEmoji_GeneratesCleanSlug()
        {
            // Arrange
            var articleDto = new ArticleAddDto 
            { 
                Title = TestConstants.EdgeCase.EmojiTitle, // "Hello 👋 World 🌍"
                Content = "Content" 
            };
            var articleEntity = new Article { Title = articleDto.Title };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);
            _mockCurrentUserService.Setup(x => x.UserId).Returns(Guid.NewGuid());
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(false);

            // Act
            var result = await _articleService.AddAsync(articleDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(TestConstants.EdgeCase.ExpectedEmojiSlug, articleEntity.Slug); // "hello-world"
            Assert.DoesNotContain("👋", articleEntity.Slug);
            Assert.DoesNotContain("🌍", articleEntity.Slug);
        }

        [Fact]
        public async Task AddAsync_WhenTitleIsTurkishWithSpecialChars_GeneratesCorrectSlug()
        {
            // Arrange
            var articleDto = new ArticleAddDto 
            { 
                Title = TestConstants.EdgeCase.TurkishSpecialTitle, // "Çok Özel İçerik Şırınga"
                Content = "Content" 
            };
            var articleEntity = new Article { Title = articleDto.Title };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);
            _mockCurrentUserService.Setup(x => x.UserId).Returns(Guid.NewGuid());
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(false);

            // Act
            var result = await _articleService.AddAsync(articleDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(TestConstants.EdgeCase.ExpectedTurkishSlug, articleEntity.Slug); // "cok-ozel-icerik-siringa"
        }

        [Fact]
        public async Task AddAsync_WhenSlugCollidesMultipleTimes_IncrementsCounterCorrectly()
        {
            // Arrange - Tests slug collision RETRY LOGIC (not true concurrency/race conditions)
            // Simulates scenario: "test-article", "test-article-1", "test-article-2" already exist
            var articleDto = new ArticleAddDto { Title = TestConstants.Article.TestTitle, Content = "Content" };
            var articleEntity = new Article { Title = articleDto.Title };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);
            _mockCurrentUserService.Setup(x => x.UserId).Returns(Guid.NewGuid());
            
            var callCount = 0;
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(() =>
                     {
                         callCount++;
                         return callCount <= 3; // "test-article", "test-article-1", "test-article-2" exist
                     });

            // Act
            var result = await _articleService.AddAsync(articleDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal("test-article-3", articleEntity.Slug);
        }

        [Fact]
        public async Task UpdateAsync_WhenMainImageIsNull_UpdatesSuccessfully()
        {
            // Arrange
            var updateDto = new ArticleUpdateDto
            {
                Id = _testArticleId,
                Title = "Updated",
                Content = "Content",
                CategoryId = _testCategoryId,
                LanguageCode = "en",
                MainImage = null // NULL image
            };

            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(_testArticle);
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(false);

            // Act
            var result = await _articleService.UpdateAsync(updateDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Null(_testArticle.MainImage);
        }

        [Fact]
        public async Task GetPagedListAsync_WithNullLanguageAndCategory_ReturnsAllArticles()
        {
            // Arrange
            var paginationParams = new PaginationParams();
            var articles = new List<Article> 
            { 
                new Article { Id = Guid.NewGuid(), Title = "Article 1", Slug = "article-1", LanguageCode = "tr" },
                new Article { Id = Guid.NewGuid(), Title = "Article 2", Slug = "article-2", LanguageCode = "en" }
            };
            var pagedResult = new PagedResult<Article>(articles, 2, 1, 10);

            _mockRepo.Setup(x => x.GetPagedListAsync(
                It.IsAny<PaginationParams>(),
                It.IsAny<Expression<Func<Article, bool>>>(),
                It.IsAny<Func<IQueryable<Article>, IOrderedQueryable<Article>>>(),
                It.IsAny<Expression<Func<Article, object>>[]>()))
                .ReturnsAsync(pagedResult);

            _mockMapper.Setup(m => m.Map<List<ArticleListDto>>(It.IsAny<List<Article>>()))
                       .Returns(new List<ArticleListDto> 
                       { 
                           new ArticleListDto { Slug = "article-1" },
                           new ArticleListDto { Slug = "article-2" }
                       });

            // Act - Both filters are NULL
            var result = await _articleService.GetPagedListAsync(paginationParams, null, null);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Data.Count);
            Assert.Equal(2, result.TotalCount);
        }

        [Fact]
        public async Task UpdateAsync_WhenChangingToExistingTitle_GeneratesUniqueSlug()
        {
            // Arrange - Update to a title that's DIFFERENT from current, triggering regeneration
            var updateDto = new ArticleUpdateDto
            {
                Id = _testArticleId,
                Title = "Updated Article Title", // Different from "Test Article"
                Content = "Content",
                CategoryId = _testCategoryId,
                LanguageCode = "en"
            };

            _mockRepo.Setup(x => x.GetByIdAsync(_testArticleId))
                     .ReturnsAsync(_testArticle);
            
            var callCount = 0;
            _mockRepo.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(() =>
                     {
                         callCount++;
                         return callCount == 1; // First slug "updated-article-title" exists
                     });

            // Act
            var result = await _articleService.UpdateAsync(updateDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotEqual("test-article", _testArticle.Slug); // Should change from original
            Assert.Contains("updated-article-title", _testArticle.Slug); // Should contain base slug
        }

        #endregion
    }
}
