using MustafaGuler.Core.Common;
using System;

namespace MustafaGuler.Core.Entities
{
    public class Subscriber : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string? Source { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
