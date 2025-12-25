using MustafaGuler.Core.DTOs;

namespace MustafaGuler.Core.Interfaces
{
    public interface IAuthCookieService
    {
        void SetAuthCookies(TokenDto tokenDto);
        void ClearAuthCookies();
    }
}
