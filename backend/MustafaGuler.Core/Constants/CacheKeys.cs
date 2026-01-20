namespace MustafaGuler.Core.Constants
{
    public static class CacheKeys
    {
        public const string SpotlightPrefix = "Spotlight_";
        public static string GetSpotlightKey(string category) => $"{SpotlightPrefix}{category}";
    }
}
