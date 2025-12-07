using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;
using MustafaGuler.Core.Constants;
using MustafaGuler.Service.Services;
using System.Threading.Tasks;
using Xunit;

namespace MustafaGuler.Service.Tests
{
    public class ImageServiceTests
    {
        private readonly Mock<IWebHostEnvironment> _mockEnvironment;
        private readonly ImageService _imageService;

        public ImageServiceTests()
        {
            _mockEnvironment = new Mock<IWebHostEnvironment>();
            _mockEnvironment.Setup(e => e.WebRootPath).Returns("fake/path/wwwroot");
            _imageService = new ImageService(_mockEnvironment.Object);
        }

        [Fact]
        public async Task UploadAsync_WhenFileIsNull_ReturnsError()
        {

            var result = await _imageService.UploadAsync(null, "some-name");

            Assert.False(result.IsSuccess);
            Assert.Equal("No file uploaded.", result.Message);
        }

        [Fact]
        public async Task UploadAsync_WhenFileSizeExceedsLimit_ReturnsError()
        {
            var mockFile = new Mock<IFormFile>();

            mockFile.Setup(f => f.Length).Returns(6291456);

            var result = await _imageService.UploadAsync(mockFile.Object, "some-name");

            Assert.False(result.IsSuccess);
            Assert.Equal("File size exceeds the 5MB limit.", result.Message);
        }

        [Fact]
        public async Task UploadAsync_WhenExtensionIsInvalid_ReturnsError()
        {
            var mockFile = new Mock<IFormFile>();

            mockFile.Setup(f => f.Length).Returns(1024);
            mockFile.Setup(f => f.FileName).Returns("document.pdf");

            var result = await _imageService.UploadAsync(mockFile.Object, "my-document");

            Assert.False(result.IsSuccess);
            Assert.Equal("Invalid file type. Only JPG, JPEG, and PNG are allowed.", result.Message);
        }

    }
}