using System.Text.RegularExpressions;

namespace MustafaGuler.Core.Utilities.Helpers
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;

            // Somehow toLowerInvariant does not convert Turkish characters correctly, so we handle them first
            text = text.Replace("İ", "i");
            text = text.Replace("I", "i");
            text = text.Replace("Ğ", "g");
            text = text.Replace("Ü", "u");
            text = text.Replace("Ş", "s");
            text = text.Replace("Ö", "o");
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