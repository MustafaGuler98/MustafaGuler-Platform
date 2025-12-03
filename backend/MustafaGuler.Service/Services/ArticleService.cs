using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;

namespace MustafaGuler.Service.Services
{
    public class ArticleService : Service<Article>, IArticleService
    {
        public ArticleService(IGenericRepository<Article> repository, IUnitOfWork unitOfWork)
            : base(repository, unitOfWork)
        {
        }
    }
}