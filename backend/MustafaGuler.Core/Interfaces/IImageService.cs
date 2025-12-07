using Microsoft.AspNetCore.Http;
using MustafaGuler.Core.Utilities.Results;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IImageService
    {
        Task<Result<string>> UploadAsync(IFormFile file, string customName);
    }
}