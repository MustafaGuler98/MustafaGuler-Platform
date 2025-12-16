using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Utilities.Results;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IAuthService
    {
        Task<Result<TokenDto>> LoginAsync(LoginDto loginDto);
    }
}
