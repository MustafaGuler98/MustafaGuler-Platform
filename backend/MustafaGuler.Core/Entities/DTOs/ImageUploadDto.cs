using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace MustafaGuler.Core.Entities.DTOs
{
    public class ImageUploadDto
    {
        [Required]
        public string CustomName { get; set; } // User defined name

        [Required]
        public IFormFile File { get; set; } // The actual file binary
    }
}
