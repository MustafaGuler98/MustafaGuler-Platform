using System;

namespace MustafaGuler.Core.DTOs.Archives.Spotlight
{
    public class SpotlightHistoryDto
    {
        public Guid Id { get; set; }
        public Guid ItemId { get; set; }
        public string ItemTitle { get; set; } = string.Empty;
        public string? ItemImageUrl { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsManualSelection { get; set; }
        public bool IsActive { get; set; }
    }
}
