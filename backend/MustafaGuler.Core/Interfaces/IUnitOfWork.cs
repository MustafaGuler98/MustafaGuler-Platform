using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IUnitOfWork
    {
        Task CommitAsync(); // SaveChangesAsync()
        void Commit(); // Sync version
    }
}