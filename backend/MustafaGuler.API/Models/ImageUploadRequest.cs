using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace MustafaGuler.API.Models
{
    // This stays in API layer because it uses IFormFile (ASP.NET).
    public class ImageUploadRequest
    {
        [Required]
        public IFormFile File { get; set; } = null!;

        [Required]
        public string CustomName { get; set; } = null!;

        public string? Folder { get; set; }
    }
}
