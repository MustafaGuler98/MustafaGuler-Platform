using System;

namespace MustafaGuler.Core.DTOs
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }
    }
}
