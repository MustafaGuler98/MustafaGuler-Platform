using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Interfaces
{
    public interface IService<T> where T : BaseEntity
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(Guid id);
        Task<T> AddAsync(T entity);
        Task RemoveAsync(Guid id);
        Task UpdateAsync(T entity);
    }
}