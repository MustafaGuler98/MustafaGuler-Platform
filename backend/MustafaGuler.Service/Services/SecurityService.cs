using System.Net;
using System.Text.RegularExpressions;
using MustafaGuler.Core.Interfaces;

namespace MustafaGuler.Service.Services
{
    public class SecurityService : ISecurityService
    {
        public string SanitizeForHtml(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return WebUtility.HtmlEncode(input);
        }

        public string SanitizeForHeader(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return Regex.Replace(input, @"[\r\n]+", " ").Trim();
        }

        public string SanitizeEmail(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return Regex.Replace(input, @"[\r\n\s]+", "").Trim();
        }
    }
}
