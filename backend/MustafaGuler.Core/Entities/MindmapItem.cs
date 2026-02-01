using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities
{
    public class MindmapItem : BaseEntity
    {
        public string Text { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}
