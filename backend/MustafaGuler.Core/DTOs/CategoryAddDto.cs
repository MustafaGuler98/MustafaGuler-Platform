using System;

namespace MustafaGuler.Core.DTOs
{
    public class CategoryAddDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }
    }
}
