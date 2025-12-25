using System;

namespace MustafaGuler.Core.DTOs
{
    public class ImageInfoDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = null!;
        public string Url { get; set; } = null!;
        public long SizeBytes { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ContentType { get; set; } = null!;
        public string? Alt { get; set; }
        public string? Title { get; set; }
        public string? UploadedByName { get; set; }
    }
}
