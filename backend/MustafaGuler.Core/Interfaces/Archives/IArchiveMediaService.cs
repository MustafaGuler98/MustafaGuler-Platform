using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Core.Parameters;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IArchiveMediaService<TDto, TCreateDto, TUpdateDto>
    {
        Task<Result<IEnumerable<TDto>>> GetAllAsync();
        Task<Result<PagedResult<TDto>>> GetPagedListAsync(ArchiveQueryParams queryParams);
        Task<Result<TDto>> GetByIdAsync(Guid id);
        Task<Result<TDto>> GetRandomAsync();
        Task<Result<TDto>> AddAsync(TCreateDto dto);
        Task<Result> UpdateAsync(Guid id, TUpdateDto dto);
        Task<Result> DeleteAsync(Guid id);
    }
}
