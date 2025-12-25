using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using System.Collections.Generic;

namespace MustafaGuler.Core.Interfaces
{
    public interface ITokenService
    {
        TokenDto GenerateToken(AppUser user, IList<string> roles);
    }
}
