using System;

namespace MustafaGuler.Core.Interfaces
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }
    }
}
