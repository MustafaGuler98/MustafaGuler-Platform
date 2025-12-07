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
        Task<IDataResult<IEnumerable<ArticleListDto>>> GetAllAsync(string? languageCode = null, Guid? categoryId = null);
        Task<IDataResult<ArticleDetailDto>> GetBySlugAsync(string slug);
        Task<IResult> AddAsync(ArticleAddDto articleAddDto);
    }
}