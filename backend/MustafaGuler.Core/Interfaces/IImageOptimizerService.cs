using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IImageOptimizerService
    {
        Task<string> GetOrGenerateOptimizedImageAsync(string sourceUrl, int width, int quality, string format, string outputCacheDir);
    }
}
