using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities
{
    public class Image : BaseEntity
    {
        public string FileName { get; set; } = null!;
        public string Url { get; set; } = null!;
        public long SizeBytes { get; set; }
        public string ContentType { get; set; } = null!;

        // SEO metadata
        public string? Alt { get; set; }
        public string? Title { get; set; }

        public Guid? UploadedById { get; set; }
        public AppUser? UploadedBy { get; set; }
    }
}
