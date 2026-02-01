using AutoMapper;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Results;

using Microsoft.Extensions.Caching.Memory;

namespace MustafaGuler.Service.Services
{
    public class MindmapService : IMindmapService
    {
        private readonly IGenericRepository<MindmapItem> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        private readonly IMemoryCache _memoryCache;

        private const string CacheKeyItems = "Mindmap:ActiveItems";
        private const string CacheKeyVersion = "Mindmap:Version";

        public MindmapService(IGenericRepository<MindmapItem> repository, IUnitOfWork unitOfWork, IMapper mapper, IMemoryCache memoryCache)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _memoryCache = memoryCache;
        }



        public async Task<Result<IEnumerable<string>>> GetAllActiveItemTextsAsync()
        {
            if (_memoryCache.TryGetValue(CacheKeyItems, out IEnumerable<string>? cachedItems) && cachedItems != null)
            {
                return Result<IEnumerable<string>>.Success(cachedItems);
            }

            var items = await _repository.GetProjectedListAsync(
                selector: x => x.Text,
                filter: x => x.IsActive && !x.IsDeleted
            );

            _memoryCache.Set(CacheKeyItems, items, TimeSpan.FromHours(1));
            return Result<IEnumerable<string>>.Success(items);
        }

        public Task<Guid> GetVersionAsync()
        {
            return Task.FromResult(_memoryCache.GetOrCreate(CacheKeyVersion, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24);
                return Guid.NewGuid();
            }));
        }

        private void InvalidateCache()
        {
            _memoryCache.Remove(CacheKeyItems);
            _memoryCache.Set(CacheKeyVersion, Guid.NewGuid(), TimeSpan.FromHours(24));
        }

        public async Task<Result<IEnumerable<MindmapItemDto>>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync(x => !x.IsDeleted);
            var dtos = _mapper.Map<IEnumerable<MindmapItemDto>>(entities);
            return Result<IEnumerable<MindmapItemDto>>.Success(dtos);
        }

        public async Task<Result<MindmapItemDto>> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return Result<MindmapItemDto>.Failure(404, "Item not found.");

            var dto = _mapper.Map<MindmapItemDto>(entity);
            return Result<MindmapItemDto>.Success(dto);
        }

        public async Task<Result> AddAsync(MindmapItemAddDto mindmapItemAddDto)
        {
            var entity = _mapper.Map<MindmapItem>(mindmapItemAddDto);
            entity.Id = Guid.NewGuid();
            entity.CreatedDate = DateTime.UtcNow;
            entity.IsActive = true;
            entity.IsDeleted = false;

            await _repository.AddAsync(entity);
            await _unitOfWork.CommitAsync();

            InvalidateCache();

            return Result.Success(201, "Item added successfully.");
        }

        public async Task<Result> UpdateAsync(MindmapItemUpdateDto mindmapItemUpdateDto)
        {
            var entity = await _repository.GetByIdAsync(mindmapItemUpdateDto.Id);
            if (entity == null || entity.IsDeleted) return Result.Failure(404, "Item not found.");

            entity.Text = mindmapItemUpdateDto.Text;
            entity.IsActive = mindmapItemUpdateDto.IsActive;
            entity.UpdatedDate = DateTime.UtcNow;

            _repository.Update(entity);
            await _unitOfWork.CommitAsync();

            InvalidateCache();

            return Result.Success(200, "Item updated successfully.");
        }

        public async Task<Result> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return Result.Failure(404, "Item not found.");

            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.UtcNow;

            _repository.Update(entity);
            await _unitOfWork.CommitAsync();

            InvalidateCache();

            return Result.Success(200, "Item deleted successfully.");
        }
    }
}
