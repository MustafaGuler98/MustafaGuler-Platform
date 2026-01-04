using System;
using System.Collections.Generic;

namespace MustafaGuler.Core.Utilities.Results
{
    public class PagedResult<T> : Result<List<T>>
    {
        public int PageNumber { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }
        public int TotalPages { get; private set; }
        public bool HasPrevious => PageNumber > 1;
        public bool HasNext => PageNumber < TotalPages;

        public PagedResult(List<T> data, int totalCount, int pageNumber, int pageSize) 
            : base(data, true, 200, null!)
        {
            TotalCount = totalCount;
            PageSize = pageSize;
            PageNumber = pageNumber;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        }

        private PagedResult(bool isSuccess, int statusCode, string message, List<string>? errors)
             : base(default!, isSuccess, statusCode, message, errors)
        {
        }

        public static PagedResult<T> FailurePaged(int statusCode, string message, List<string>? errors = null)
        {
             return new PagedResult<T>(false, statusCode, message, errors);
        }
    }
}
