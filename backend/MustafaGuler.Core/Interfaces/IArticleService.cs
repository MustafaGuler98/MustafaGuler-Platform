using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IArticleService
    {
        Task<Result<IEnumerable<ArticleListDto>>> GetAllAsync(string? languageCode = null, Guid? categoryId = null);
        Task<PagedResult<ArticleListDto>> GetPagedListAsync(ArticleQueryParams queryParams);
        Task<Result<IEnumerable<ArticleListDto>>> GetPopularAsync(int count = 9, string? languageCode = null);
        Task<Result<ArticleDetailDto>> GetBySlugAsync(string slug);
        Task<Result<ArticleDetailDto>> GetByIdAsync(Guid id);
        Task<Result> AddAsync(ArticleAddDto articleAddDto);
        Task<Result> UpdateAsync(ArticleUpdateDto articleUpdateDto);
        Task<Result> DeleteAsync(Guid id);
    }
}