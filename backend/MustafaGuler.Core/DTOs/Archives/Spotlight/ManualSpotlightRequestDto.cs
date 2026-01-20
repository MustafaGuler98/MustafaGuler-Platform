using System;

namespace MustafaGuler.Core.DTOs.Archives.Spotlight
{
    public class ManualSpotlightRequestDto
    {
        public string Category { get; set; } = string.Empty;
        public Guid ItemId { get; set; }
        public DateTime EndDate { get; set; }
    }
}
