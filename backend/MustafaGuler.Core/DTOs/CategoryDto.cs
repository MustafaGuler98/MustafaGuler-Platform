using System;

namespace MustafaGuler.Core.DTOs
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }
    }
}
