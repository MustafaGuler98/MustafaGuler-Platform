using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface ITokenService
    {
        Task<TokenDto> GenerateTokenAsync(AppUser user);
    }
}
