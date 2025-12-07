using MustafaGuler.Core.DTOs;
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
        Task<Result<ArticleDetailDto>> GetBySlugAsync(string slug);
        Task<Result> AddAsync(ArticleAddDto articleAddDto);
    }
}