using System;
using System.Collections.Generic;
using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string Description { get; set; } = null!;

        // Subcategory Logic, not used initially but planned for future
        public Guid? ParentId { get; set; } // Nullable because top-level categories have no parent
        public Category? Parent { get; set; }
        public ICollection<Category> SubCategories { get; set; } = new List<Category>();

        public ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}