using System.IO;

namespace MustafaGuler.Core.DTOs
{
    public class FileUploadData
    {
        // Using this to decouple from IFormFile dependency.
        public Stream Content { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public string ContentType { get; set; } = null!;
        public long Length { get; set; }
    }
}
