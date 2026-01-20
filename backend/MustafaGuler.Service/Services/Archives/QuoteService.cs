using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Core.Parameters;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    // QuoteService does not inherit from BaseMediaService. The duplication checks and retrieval logic are unique.
    public class QuoteService : IQuoteService
    {
        private readonly IGenericRepository<Quote> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;


        public QuoteService(
            IGenericRepository<Quote> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<IEnumerable<QuoteDto>>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync(e => !e.IsDeleted);
            var dtos = _mapper.Map<IEnumerable<QuoteDto>>(entities);
            return Result<IEnumerable<QuoteDto>>.Success(dtos);
        }

        public async Task<Result<PagedResult<QuoteDto>>> GetPagedListAsync(ArchiveQueryParams queryParams)
        {
            var entities = await _repository.GetPagedListAsync(
                queryParams,
                filter: e => !e.IsDeleted && (string.IsNullOrEmpty(queryParams.SearchTerm) || e.Content.Contains(queryParams.SearchTerm) || e.Author.Contains(queryParams.SearchTerm)),
                orderBy: q => queryParams.SortOrder == "asc" ? q.OrderBy(x => x.CreatedDate) : q.OrderByDescending(x => x.CreatedDate)
            );

            var dtos = _mapper.Map<List<QuoteDto>>(entities.Items);
            return Result<PagedResult<QuoteDto>>.Success(new PagedResult<QuoteDto>(dtos, entities.TotalCount, entities.PageNumber, entities.PageSize));
        }

        public async Task<Result<QuoteDto>> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetAsync(e => e.Id == id && !e.IsDeleted);
            if (entity == null)
                return Result<QuoteDto>.Failure(404, "Quote not found");

            var dto = _mapper.Map<QuoteDto>(entity);
            return Result<QuoteDto>.Success(dto);
        }

        public async Task<Result<QuoteDto>> GetRandomAsync()
        {
            var randomQuote = await _repository.GetRandomAsync(q => !q.IsDeleted);

            if (randomQuote == null)
                return Result<QuoteDto>.Failure(404, "No quotes found");

            var dto = _mapper.Map<QuoteDto>(randomQuote);
            return Result<QuoteDto>.Success(dto);
        }

        public async Task<Result<QuoteDto>> AddAsync(CreateQuoteDto dto)
        {
            var contentPrefix = dto.Content.Length > 200 ? dto.Content[..200] : dto.Content;
            var isDuplicate = await _repository.AnyAsync(q => q.Content.StartsWith(contentPrefix) && !q.IsDeleted);

            if (isDuplicate)
                return Result<QuoteDto>.Failure(400, "A similar quote already exists");

            var entity = _mapper.Map<Quote>(dto);
            entity.Id = Guid.NewGuid();
            entity.CreatedDate = DateTime.UtcNow;

            await _repository.AddAsync(entity);
            await _unitOfWork.CommitAsync();

            var resultDto = _mapper.Map<QuoteDto>(entity);
            return Result<QuoteDto>.Success(resultDto, 201, "Quote added successfully");
        }

        public async Task<Result> UpdateAsync(Guid id, UpdateQuoteDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted)
                return Result.Failure(404, "Quote not found");

            _mapper.Map(dto, entity);
            entity.UpdatedDate = DateTime.UtcNow;

            _repository.Update(entity);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, "Quote updated successfully");
        }

        public async Task<Result> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted)
                return Result.Failure(404, "Quote not found");

            // Soft delete
            entity.IsDeleted = true;
            entity.UpdatedDate = DateTime.UtcNow;

            _repository.Update(entity);
            await _unitOfWork.CommitAsync();

            return Result.Success(200, "Quote deleted successfully");
        }
    }
}
