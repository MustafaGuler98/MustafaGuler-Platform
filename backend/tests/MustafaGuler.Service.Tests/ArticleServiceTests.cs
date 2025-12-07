using AutoMapper;
using Moq;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
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
        private readonly ArticleService _articleService;

        public ArticleServiceTests()
        {
            _mockRepo = new Mock<IGenericRepository<Article>>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();

            _articleService = new ArticleService(_mockRepo.Object, _mockUnitOfWork.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task AddAsync_WhenSlugExistsInDb_AppendsCounterToSlug()
        {
            var articleDto = new ArticleAddDto { Title = "Test Article", Content = "Content..." };
            var articleEntity = new Article { Title = "Test Article" };

            _mockMapper.Setup(m => m.Map<Article>(articleDto)).Returns(articleEntity);


            // First check: "test-article" -> Exists (True)
            // Second check: "test-article-1" -> Does not exist (False)
            _mockRepo.SetupSequence(x => x.AnyAsync(It.IsAny<Expression<Func<Article, bool>>>()))
                     .ReturnsAsync(true)  
                     .ReturnsAsync(false);

            await _articleService.AddAsync(articleDto);

            Assert.Equal("test-article-1", articleEntity.Slug);

            _mockRepo.Verify(x => x.AddAsync(It.IsAny<Article>()), Times.Once);

            _mockUnitOfWork.Verify(x => x.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WhenTitleIsEmpty_ReturnsErrorResult()
        {
            var articleDto = new ArticleAddDto { Title = "" };

            var result = await _articleService.AddAsync(articleDto);

            Assert.False(result.Success);
            Assert.Equal("Title is required.", result.Message);

            _mockRepo.Verify(x => x.AddAsync(It.IsAny<Article>()), Times.Never);
        }
    }
}