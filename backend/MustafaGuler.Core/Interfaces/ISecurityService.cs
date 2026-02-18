using System;
using System.Net;
using System.Text.RegularExpressions;

namespace MustafaGuler.Core.Interfaces
{
    public interface ISecurityService
    {
        string SanitizeForHtml(string input);
        string SanitizeForHeader(string input);
        string SanitizeEmail(string input);
    }
}
