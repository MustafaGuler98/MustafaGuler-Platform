// File: MustafaGuler.Core/Interfaces/IArticleService.cs

using System.Collections.Generic;
using System.Threading.Tasks;
using MustafaGuler.Core.DTOs; // Added DTO namespace
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces
{
    public interface IArticleService
    {
        Task<IDataResult<IEnumerable<Article>>> GetAllAsync();
        Task<IResult> AddAsync(ArticleAddDto articleAddDto);
    }
}