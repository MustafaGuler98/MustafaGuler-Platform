using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Service.Services
{
    public interface IMindmapService
    {

        Task<Result<IEnumerable<string>>> GetAllActiveItemTextsAsync();
        Task<Guid> GetVersionAsync();
        Task<Result<IEnumerable<MindmapItemDto>>> GetAllAsync();
        Task<Result<MindmapItemDto>> GetByIdAsync(Guid id);
        Task<Result> AddAsync(MindmapItemAddDto mindmapItemAddDto);
        Task<Result> UpdateAsync(MindmapItemUpdateDto mindmapItemUpdateDto);
        Task<Result> DeleteAsync(Guid id);
    }
}
