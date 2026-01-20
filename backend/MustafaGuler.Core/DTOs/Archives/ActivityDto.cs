namespace MustafaGuler.Core.DTOs.Archives
{

    public class ActivityDto
    {
        public string ActivityType { get; set; } = string.Empty;
        public Guid? SelectedItemId { get; set; }
        public string? SelectedItemTitle { get; set; }
        public string? SelectedItemImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }


    public class UpdateActivityDto
    {
        public string ActivityType { get; set; } = string.Empty;
        public Guid? SelectedItemId { get; set; }
    }


    public class ActivityOptionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Subtitle { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
