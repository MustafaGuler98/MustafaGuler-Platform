namespace MustafaGuler.Core.Constants
{
    public static class Messages
    {
        // General
        public const string Success = "Operation successful.";
        public const string Failure = "An error occurred.";
        public const string InternalServerError = "Internal Server Error!";

        // Article Messages
        public const string ArticlesListed = "Articles listed successfully.";
        public const string ArticleAdded = "Article added successfully.";
        public const string ArticleUpdated = "Article updated successfully.";
        public const string ArticleDeleted = "Article deleted successfully.";
        public const string ArticleNotFound = "Article not found.";
        public const string NoArticlesFound = "No articles found.";
        public const string ArticleTitleRequired = "Title is required.";

        // Category Messages
        public const string CategoryNotFound = "Category not found.";
        public const string CategoryAdded = "Category added successfully.";
        public const string CategoryUpdated = "Category updated successfully.";
        public const string CategoryDeleted = "Category deleted successfully.";
        public const string CannotDeleteOtherCategory = "Cannot delete the 'Other' category.";

        // Image Messages
        public const string ImageUploaded = "Image uploaded successfully.";
        public const string NoFileUploaded = "No file uploaded.";
        public const string FileSizeLimitExceeded = "File size exceeds the 10MB limit.";
        public const string InvalidFileType = "Invalid file type. Only JPG, JPEG, and PNG are allowed.";
        public const string InvalidFilename = "Invalid filename provided.";
        public const string FileAlreadyExists = "A file with the name '{0}' already exists. Please choose a different name.";
        public const string ImageNotFound = "Image not found.";
        public const string ImageDeleted = "Image deleted successfully.";
        public const string ImageUpdated = "Image updated successfully.";

        // Auth Messages
        public const string Unauthorized = "Authentication required. Please login.";
        public const string Forbidden = "You do not have permission to access this resource.";
    }
}