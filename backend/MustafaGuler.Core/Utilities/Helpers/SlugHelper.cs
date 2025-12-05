using System.Text.RegularExpressions;

namespace MustafaGuler.Core.Utilities.Helpers
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;

            text = text.ToLowerInvariant();

            // Normalization
            text = text.Replace("ı", "i");
            text = text.Replace("ö", "o");
            text = text.Replace("ü", "u");
            text = text.Replace("ş", "s");
            text = text.Replace("ğ", "g");
            text = text.Replace("ç", "c");

            text = Regex.Replace(text, @"[^a-z0-9\s-]", "");

            text = Regex.Replace(text, @"\s+", " ").Trim();
            text = text.Replace(" ", "-");

            return text;
        }
    }
}