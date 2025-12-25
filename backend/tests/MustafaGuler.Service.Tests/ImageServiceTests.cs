using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Moq;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Service.Services;
using System;
using System.IO;
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
            _mockEnvironment.Setup(e => e.WebRootPath).Returns("fake/path/wwwroot");

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

        [Fact]
        public async Task UploadAsync_WhenFileIsNull_ReturnsError()
        {
            var result = await _imageService.UploadAsync(null!, "some-name");

            Assert.False(result.IsSuccess);
            Assert.Equal("No file uploaded.", result.Message);
        }

        [Fact]
        public async Task UploadAsync_WhenFileSizeExceedsLimit_ReturnsError()
        {
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = "test.jpg",
                ContentType = "image/jpeg",
                Length = 11 * 1024 * 1024  // 11 MB - exceeds 10MB limit
            };

            var result = await _imageService.UploadAsync(fileData, "some-name");

            Assert.False(result.IsSuccess);
            Assert.Equal("File size exceeds the 10MB limit.", result.Message);
        }

        [Fact]
        public async Task UploadAsync_WhenExtensionIsInvalid_ReturnsError()
        {
            var fileData = new FileUploadData
            {
                Content = new MemoryStream(),
                FileName = "document.pdf",
                ContentType = "application/pdf",
                Length = 1024
            };

            var result = await _imageService.UploadAsync(fileData, "my-document");

            Assert.False(result.IsSuccess);
            Assert.Equal("Invalid file type. Only JPG, JPEG, and PNG are allowed.", result.Message);
        }
    }
}
