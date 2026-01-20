using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MustafaGuler.Core.Common;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces
{

    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T?> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync(
           Expression<Func<T, bool>>? filter = null,
           params Expression<Func<T, object?>>[] includes);

        Task AddAsync(T entity);
        void Remove(T entity);
        void Update(T entity);

        Task<bool> AnyAsync(Expression<Func<T, bool>> expression);
        Task<T?> GetAsync(Expression<Func<T, bool>> filter, params Expression<Func<T, object?>>[] includes);
        Task<T?> GetAsync(Expression<Func<T, bool>> filter, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null, params Expression<Func<T, object?>>[] includes);

        Task<PagedResult<T>> GetPagedListAsync(
            PaginationParams paginationParams,
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            params Expression<Func<T, object?>>[] includes);

        Task<int> CountAsync(Expression<Func<T, bool>>? filter = null);

        Task<T?> GetRandomAsync(Expression<Func<T, bool>>? filter = null);
    }
}