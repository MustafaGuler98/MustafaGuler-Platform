using System.Threading.Tasks;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces.Archives.Providers
{
    public interface IProviderFactory
    {
        Result<IActivityProvider> GetProvider(string activityType);
    }
}
