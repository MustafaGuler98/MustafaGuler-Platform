using System;

namespace MustafaGuler.Core.DTOs.Archives
{
    public class QuoteDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string? Source { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateQuoteDto
    {
        public string Content { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string? Source { get; set; }
    }

    public class UpdateQuoteDto
    {
        public string Content { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string? Source { get; set; }
    }
}
