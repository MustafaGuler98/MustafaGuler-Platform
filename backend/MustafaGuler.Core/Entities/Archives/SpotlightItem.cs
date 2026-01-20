using MustafaGuler.Core.Common;
using System;

namespace MustafaGuler.Core.Entities.Archives
{
    public class SpotlightItem : BaseEntity
    {

        public string Category { get; set; } = string.Empty;
        public Guid ItemId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsManualSelection { get; set; } = false;
    }
}
