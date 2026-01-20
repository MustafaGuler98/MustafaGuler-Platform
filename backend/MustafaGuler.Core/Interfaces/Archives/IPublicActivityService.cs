using System.Threading.Tasks;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IPublicActivityService
    {
        Task<Result<PublicActivitiesDto>> GetPublicActivitiesAsync();
    }
}
