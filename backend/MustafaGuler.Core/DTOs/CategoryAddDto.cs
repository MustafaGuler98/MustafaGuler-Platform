using System;

namespace MustafaGuler.Core.DTOs
{
    public class CategoryAddDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }
    }
}
