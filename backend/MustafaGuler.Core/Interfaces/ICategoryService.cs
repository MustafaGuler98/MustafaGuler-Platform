using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<IEnumerable<CategoryDto>>> GetAllAsync();
        Task<Result<CategoryDto>> GetByIdAsync(Guid id);
        Task<Result> AddAsync(CategoryAddDto categoryAddDto);
        Task<Result> UpdateAsync(CategoryUpdateDto categoryUpdateDto);
        Task<Result> DeleteAsync(Guid id);
    }
}
