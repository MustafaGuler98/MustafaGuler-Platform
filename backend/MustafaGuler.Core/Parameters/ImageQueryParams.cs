namespace MustafaGuler.Core.Parameters
{
    public class ImageQueryParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
        public string? Folder { get; set; }
    }
}
