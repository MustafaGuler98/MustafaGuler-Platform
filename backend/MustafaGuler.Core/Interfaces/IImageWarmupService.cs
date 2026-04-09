namespace MustafaGuler.Core.Interfaces
{
    public interface IImageWarmupService
    {
        void EnqueueWarmup(string imageUrl);

        void EnqueuePurge(string imageUrl);
    }
}
