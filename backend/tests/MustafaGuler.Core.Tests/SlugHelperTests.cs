using MustafaGuler.Core.Utilities.Helpers;
using Xunit;

namespace MustafaGuler.Core.Tests
{
    public class SlugHelperTests
    {
        // Test 1: Standard English text
        [Fact]
        public void GenerateSlug_WhenTextIsStandardEnglish_ReturnsSlugifiedString()
        {
            string text = "Hello World This Is Unit Test";
            string expected = "hello-world-this-is-unit-test";

            string result = SlugHelper.GenerateSlug(text);

            Assert.Equal(expected, result);
        }

        // Test 2: Turkish characters
        [Fact]
        public void GenerateSlug_WhenTextContainsTurkishCharacters_ReturnsEnglishCharacters()
        {
            string text = "Şeker Yiyelim Çay İçelim Ğ";
            string expected = "seker-yiyelim-cay-icelim-g";

            string result = SlugHelper.GenerateSlug(text);

            Assert.Equal(expected, result);
        }

        // Test 3: Multiple spaces and trim
        [Fact]
        public void GenerateSlug_WhenTextHasMultipleSpaces_RemovesExtraSpaces()
        {
            string text = "  DotNet    Core      Dersleri  ";
            string expected = "dotnet-core-dersleri";

            string result = SlugHelper.GenerateSlug(text);

            Assert.Equal(expected, result);
        }

        // Test 4: Empty or Null input
        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void GenerateSlug_WhenTextIsNullOrEmpty_ReturnsEmptyString(string input)
        {
            // Act
            string result = SlugHelper.GenerateSlug(input);

            // Assert
            Assert.Equal(string.Empty, result);
        }
    }
}