using System;
using System.Collections.Generic;
using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }

        // Subcategory Logic, not used initially but planned for future
        public Guid? ParentId { get; set; } // Nullable because top-level categories have no parent
        public Category Parent { get; set; }
        public ICollection<Category> SubCategories { get; set; }

        public ICollection<Article> Articles { get; set; }
    }
}