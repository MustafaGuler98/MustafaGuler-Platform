using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Interfaces {

    public interface IGenericRepository<T> where T : BaseEntity
    {
        // CRUD signatures
        Task<T> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync();

        // filters
        // IQueryable: enables deferred execution and composition of queries
        IQueryable<T> Where(Expression<Func<T, bool>> expression);

        Task<bool> AnyAsync(Expression<Func<T, bool>> expression);

        Task AddAsync(T entity);
        void Remove(T entity);
        void Update(T entity);
    }
}