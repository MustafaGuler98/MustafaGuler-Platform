using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.DTOs
{
    public class MindmapItemDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = null!;
        public bool IsActive { get; set; }
    }

    public class MindmapItemAddDto
    {
        public string Text { get; set; } = null!;
    }

    public class MindmapItemUpdateDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}
