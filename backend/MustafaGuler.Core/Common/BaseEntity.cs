using System;

namespace MustafaGuler.Core.Common
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Generate different IDs for each entity
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow; 
        public DateTime? UpdatedDate { get; set; } 
        public bool IsDeleted { get; set; } = false; // Soft delete
    }
}