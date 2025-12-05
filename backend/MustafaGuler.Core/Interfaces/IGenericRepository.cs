using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Interfaces {

    public interface IGenericRepository<T> where T : BaseEntity
    {
        // CRUD signatures
        Task<T> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync(
           Expression<Func<T, bool>>? filter = null,
           params Expression<Func<T, object>>[] includes);

        Task AddAsync(T entity);
        void Remove(T entity);
        void Update(T entity);

        Task<bool> AnyAsync(Expression<Func<T, bool>> expression);
        Task<T> GetAsync(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes);

    }
}