using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Moq;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Service.Services;
using System;
using System.IO;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

namespace MustafaGuler.Service.Tests
{
    public class ImageServiceTests
    {
        private readonly Mock<IWebHostEnvironment> _mockEnvironment;
        private readonly Mock<IGenericRepository<Image>> _mockRepository;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;
        private readonly ImageService _imageService;

        public ImageServiceTests()
        {
            _mockEnvironment = new Mock<IWebHostEnvironment>();
            _mockEnvironment.Setup(e => e.WebRootPath).Returns(TestConstants.File.FakeWebRootPath);

            _mockRepository = new Mock<IGenericRepository<Image>>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();
            _mockCurrentUserService = new Mock<ICurrentUserService>();

            _imageService = new ImageService(
                _mockEnvironment.Object,
                _mockRepository.Object,
                _mockUnitOfWork.Object,
                _mockMapper.Object,
                _mockCurrentUserService.Object);
        }

        #region Null/Empty File Tests

        [Fact]
        public async Task UploadAsync_WhenFileIsNull_ReturnsError()
        {
            var result = await _imageService.UploadAsync(null!, "some-name");

            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.NoFileUploaded, result.Message);
        }

        [Fact]
        public async Task UploadAsync_WhenFileLengthIsZero_ReturnsError()
        {
            // Arrange
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = TestConstants.File.ValidJpgName,
                ContentType = TestConstants.File.JpegContentType,
                Length = 0
            };

            // Act
            var result = await _imageService.UploadAsync(fileData, TestConstants.Article.TestSlug);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.NoFileUploaded, result.Message);
        }

        #endregion

        #region File Size Validation Tests

        [Fact]
        public async Task UploadAsync_WhenFileSizeExceedsLimit_ReturnsError()
        {
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = TestConstants.File.ValidJpgName,
                ContentType = TestConstants.File.JpegContentType,
                Length = 11 * 1024 * 1024  // 11 MB - exceeds 10MB limit
            };

            var result = await _imageService.UploadAsync(fileData, "some-name");

            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.FileSizeLimitExceeded, result.Message);
        }

        [Fact]
        public async Task UploadAsync_WhenFileSizeIsExactlyLimit_PassesSizeCheck()
        {
            // Arrange - 10MB is the limit, so exactly 10MB should pass size validation
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = TestConstants.File.ValidJpgName,
                ContentType = TestConstants.File.JpegContentType,
                Length = 10 * 1024 * 1024  // Exactly 10 MB
            };

            // Act
            var result = await _imageService.UploadAsync(fileData, "valid-name");

            // Assert - Should fail at a later stage (not size check), which means size check passed
            Assert.False(result.IsSuccess);
            Assert.NotEqual(Messages.FileSizeLimitExceeded, result.Message);
        }

        #endregion

        #region Extension Validation Tests

        [Fact]
        public async Task UploadAsync_WhenExtensionIsInvalid_ReturnsError()
        {
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = TestConstants.File.InvalidPdfName,
                ContentType = TestConstants.File.PdfContentType,
                Length = 1024
            };

            var result = await _imageService.UploadAsync(fileData, "my-document");

            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.InvalidFileType, result.Message);
        }

        [Theory]
        [InlineData(TestConstants.File.ValidJpgName)]
        [InlineData("image.jpeg")]
        [InlineData(TestConstants.File.ValidPngName)]
        [InlineData("IMAGE.JPG")]
        [InlineData("IMAGE.PNG")]
        public async Task UploadAsync_WhenExtensionIsValid_PassesExtensionCheck(string fileName)
        {
            // Arrange
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = fileName,
                ContentType = TestConstants.File.JpegContentType,
                Length = 1024
            };

            // Act
            var result = await _imageService.UploadAsync(fileData, "valid-name");

            // Assert - Should not fail at extension check
            Assert.NotEqual(Messages.InvalidFileType, result.Message);
        }

        [Theory]
        [InlineData("document.gif")]
        [InlineData("document.webp")]
        [InlineData("document.bmp")]
        [InlineData("document.svg")]
        public async Task UploadAsync_WhenExtensionNotAllowed_ReturnsError(string fileName)
        {
            // Arrange
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = fileName,
                ContentType = TestConstants.File.GifContentType,
                Length = 1024
            };

            // Act
            var result = await _imageService.UploadAsync(fileData, "test-image");

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.InvalidFileType, result.Message);
        }

        #endregion

        #region Custom Name Validation Tests

        [Fact]
        public async Task UploadAsync_WhenCustomNameIsEmpty_ReturnsError()
        {
            // Arrange
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = "test.jpg",
                ContentType = "image/jpeg",
                Length = 1024
            };

            // Act
            var result = await _imageService.UploadAsync(fileData, "");

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.InvalidFilename, result.Message);
        }

        [Fact]
        public async Task UploadAsync_WhenCustomNameIsSpecialCharsOnly_ReturnsError()
        {
            // Arrange - SlugHelper.GenerateSlug("!!!") returns empty string
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = "test.jpg",
                ContentType = "image/jpeg",
                Length = 1024
            };

            // Act
            var result = await _imageService.UploadAsync(fileData, "!!!");

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(Messages.InvalidFilename, result.Message);
        }

        #endregion

        #region Duplicate File Tests

        [Fact]
        public async Task UploadAsync_WhenFileExistsInDb_ReturnsConflict()
        {
            // Arrange
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = "test.jpg",
                ContentType = "image/jpeg",
                Length = 1024
            };

            // Setup: File already exists in DB
            _mockRepository.Setup(x => x.AnyAsync(It.IsAny<Expression<Func<Image, bool>>>()))
                           .ReturnsAsync(true);

            // Act
            var result = await _imageService.UploadAsync(fileData, "existing-image");

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(409, result.StatusCode);
            Assert.Contains("existing-image", result.Message);
        }

        #endregion
    }
}

