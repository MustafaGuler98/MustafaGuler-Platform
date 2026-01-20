using System;

namespace MustafaGuler.Core.Parameters
{
    public class ArchiveQueryParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; } = "desc";
    }
}
