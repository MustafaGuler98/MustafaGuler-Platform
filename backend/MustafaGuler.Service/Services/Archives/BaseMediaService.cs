using AutoMapper;
using MustafaGuler.Core.Common;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Entities.Archives;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public abstract class BaseMediaService<TEntity, TDto, TCreateDto, TUpdateDto>
        where TEntity : BaseMediaEntity
    {
        protected readonly IGenericRepository<TEntity> _repository;
        protected readonly IUnitOfWork _unitOfWork;
        protected readonly IMapper _mapper;

        protected BaseMediaService(
            IGenericRepository<TEntity> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public virtual async Task<Result<IEnumerable<TDto>>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync(e => !e.IsDeleted);
            var dtos = _mapper.Map<IEnumerable<TDto>>(entities);
            return Result<IEnumerable<TDto>>.Success(dtos);
        }

        public virtual async Task<Result<PagedResult<TDto>>> GetPagedListAsync(ArchiveQueryParams queryParams)
        {
            var entities = await _repository.GetPagedListAsync(
                queryParams,
                filter: e => !e.IsDeleted && (string.IsNullOrEmpty(queryParams.SearchTerm) || e.Title.Contains(queryParams.SearchTerm)),
                orderBy: q => queryParams.SortOrder == "asc" ? q.OrderBy(x => x.CreatedDate) : q.OrderByDescending(x => x.CreatedDate)
            );

            var dtos = _mapper.Map<List<TDto>>(entities.Items);
            return Result<PagedResult<TDto>>.Success(new PagedResult<TDto>(dtos, entities.TotalCount, entities.PageNumber, entities.PageSize));
        }



        public virtual async Task<Result<TDto>> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetAsync(e => e.Id == id && !e.IsDeleted);
            if (entity == null)
                return Result<TDto>.Failure(404, GetEntityName() + " not found");

            var dto = _mapper.Map<TDto>(entity);
            return Result<TDto>.Success(dto);
        }

        public virtual async Task<Result<TDto>> GetRandomAsync()
        {
            var randomEntity = await _repository.GetRandomAsync(e => !e.IsDeleted);

            if (randomEntity == null)
                return Result<TDto>.Failure(404, GetEntityName() + " not found");

            var dto = _mapper.Map<TDto>(randomEntity);
            return Result<TDto>.Success(dto);
        }

        public virtual async Task<Result<TDto>> AddAsync(TCreateDto dto)
        {
            if (await CheckDuplicateAsync(dto))
                return Result<TDto>.Failure(400, GetDuplicateMessage());

            var entity = _mapper.Map<TEntity>(dto);
            entity.Id = Guid.NewGuid();
            entity.CreatedDate = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _unitOfWork.CommitAsync();

            var resultDto = _mapper.Map<TDto>(entity);
            return Result<TDto>.Success(resultDto, 201, GetEntityName() + " added successfully");
        }

        public virtual async Task<Result> UpdateAsync(Guid id, TUpdateDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted)
                return Result.Failure(404, GetEntityName() + " not found");

            if (await CheckDuplicateOnUpdateAsync(entity, dto))
                return Result.Failure(400, GetDuplicateMessage());

            _mapper.Map(dto, entity);
            entity.UpdatedDate = DateTime.UtcNow;

            _repository.Update(entity);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, GetEntityName() + " updated successfully");
        }

        public virtual async Task<Result> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted)
                return Result.Failure(404, GetEntityName() + " not found");

            // Soft delete
            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.UtcNow;

            _repository.Update(entity);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, GetEntityName() + " deleted successfully");
        }

        // Abstract methods for entity-specific logic
        protected abstract string GetEntityName();
        protected abstract string GetDuplicateMessage();
        protected abstract Task<bool> CheckDuplicateAsync(TCreateDto dto);
        protected abstract Task<bool> CheckDuplicateOnUpdateAsync(TEntity entity, TUpdateDto dto);
    }
}
