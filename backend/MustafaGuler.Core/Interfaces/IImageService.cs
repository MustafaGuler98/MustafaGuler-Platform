using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IImageService
    {
        Task<Result<ImageInfoDto>> UploadAsync(FileUploadData fileData, string customName);
        Task<Result<PagedResult<ImageInfoDto>>> GetPagedAsync(ImageQueryParams queryParams);
        Task<Result<ImageInfoDto>> UpdateAsync(Guid id, ImageUpdateDto dto);
        Task<Result> DeleteAsync(Guid id);
    }
}