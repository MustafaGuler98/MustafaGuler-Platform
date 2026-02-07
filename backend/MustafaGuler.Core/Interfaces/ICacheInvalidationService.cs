namespace MustafaGuler.Core.Interfaces;

public interface ICacheInvalidationService
{

    Task InvalidateTagsAsync(params string[] tags);
}
