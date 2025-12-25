using System.IO;

namespace MustafaGuler.Core.DTOs
{
    public class FileUploadData
    {
        // Using this to decouple from IFormFile dependency.
        public Stream Content { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public long Length { get; set; }
    }
}
