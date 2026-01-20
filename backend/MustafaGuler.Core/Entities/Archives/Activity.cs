using MustafaGuler.Core.Common;
using System;

namespace MustafaGuler.Core.Entities.Archives
{

    public class Activity : BaseEntity
    {

        public string ActivityType { get; set; } = string.Empty;


        public Guid? SelectedItemId { get; set; }


        public int DisplayOrder { get; set; }
    }
}
