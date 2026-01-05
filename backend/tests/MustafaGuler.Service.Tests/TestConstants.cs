namespace MustafaGuler.Service.Tests
{
    public static class TestConstants
    {
        public static class Auth
        {
            public const string ValidEmail = "admin@test.com";
            public const string InvalidEmail = "notfound@test.com";
            public const string ValidPassword = "TestPassword123!";
            public const string InvalidPassword = "WrongPassword";
            public const string ValidRefreshToken = "valid-refresh-token-abc123";
            public const string InvalidRefreshToken = "invalid-refresh-token";
        }

        public static class User
        {
            public const string FirstName = "Test";
            public const string LastName = "User";
        }

        public static class Token
        {
            public const string FakeJwtToken = "fake-jwt-token";
            public const string SecurityKey = "ThisIsAVerySecureKeyForTestingPurposes123!";
            public const string Issuer = "TestIssuer";
            public const string Audience = "TestAudience";
        }

        public static class Category
        {
            public const string TechnologyName = "Technology";
            public const string TechnologySlug = "technology";
            public const string OtherName = "Other";
            public const string OtherSlug = "other";
            public const string NewCategoryName = "New Category";
            public const string NewCategoryDesc = "A new category";
            public const string YazilimName = "Yazılım Geliştirme";
            public const string YazilimDesc = "Software development";
            public const string YazilimSlug = "yazilim-gelistirme";
        }

        public static class Article
        {
            public const string TestTitle = "Test Article";
            public const string TestContent = "Content...";
            public const string TestSlug = "test-article";
            public const string TestSlugCounter = "test-article-1";
            public const string UpdatedTitle = "Updated Title";
        }

        public static class File
        {
            public const string ValidJpgName = "test.jpg";
            public const string ValidPngName = "test.png";
            public const string InvalidPdfName = "document.pdf";
            public const string FakeWebRootPath = "fake/path/wwwroot";
            public const long MaxFileSize = 10 * 1024 * 1024; // 10 MB
            
            // MIME Types
            public const string JpegContentType = "image/jpeg";
            public const string PngContentType = "image/png";
            public const string PdfContentType = "application/pdf";
            public const string GifContentType = "image/gif";
        }

        public static class Language
        {
            public const string Turkish = "tr";
            public const string English = "en";
            public const string InvalidLongCode = "english"; // For validation tests
        }

        public static class Pagination
        {
            public const int DefaultPageSize = 10;
            public const int DefaultPageNumber = 1;
            public const int MaxPageSize = 50;
            public const int SmallPageSize = 5;
        }

        public static class EdgeCase
        {
            // SQL Injection Attempt
            public const string SqlInjectionTitle = "Test'; DROP TABLE Articles--";
            public const string ExpectedSqlSlug = "test-drop-table";
            
            // XSS Attempt
            public const string XssContent = "<script>alert('xss')</script>";
            
            // Long Strings (DB Constraint Tests)
            public const string ValidTitle200 = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi";
            
            // Unicode
            public const string EmojiTitle = "Hello 👋 World 🌍";
            public const string ExpectedEmojiSlug = "hello-world";
            public const string TurkishSpecialTitle = "Çok Özel İçerik Şırınga";
            public const string ExpectedTurkishSlug = "cok-ozel-icerik-siringa";
        }
    }
}
