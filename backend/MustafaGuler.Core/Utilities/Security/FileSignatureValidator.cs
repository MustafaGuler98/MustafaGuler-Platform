using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MustafaGuler.Core.Utilities.Security
{
    public static class FileSignatureValidator
    {
        // Validates file signatures for used file types to prevent attacks.
        private static readonly Dictionary<string, List<byte[]>> _fileSignatures = new()
        {
            { ".jpg", new List<byte[]> { new byte[] { 0xFF, 0xD8, 0xFF } } },
            { ".jpeg", new List<byte[]> { new byte[] { 0xFF, 0xD8, 0xFF } } },
            { ".png", new List<byte[]> { new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A } } },
            { ".gif", new List<byte[]> { new byte[] { 0x47, 0x49, 0x46, 0x38 } } },
            { ".webp", new List<byte[]> { new byte[] { 0x52, 0x49, 0x46, 0x46 }, new byte[] { 0x57, 0x45, 0x42, 0x50 } } }
        };

        public static bool IsValidSignature(Stream stream, string extension)
        {
            if (extension == ".webp")
            {
                var header = new byte[12];
                var originalPos = stream.Position;

                if (stream.Read(header, 0, 12) < 12)
                {
                    stream.Position = originalPos;
                    return false;
                }
                stream.Position = originalPos;

                bool hasRiff = header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46;
                bool hasWebp = header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;

                return hasRiff && hasWebp;
            }

            if (!_fileSignatures.TryGetValue(extension, out var signatures)) return false;

            int maxLen = signatures.Max(x => x.Length);
            var headerBytes = new byte[maxLen];
            var originalPosRef = stream.Position;

            if (stream.Read(headerBytes, 0, maxLen) < maxLen && stream.Length < maxLen)
            {
                stream.Position = originalPosRef;
                return false;
            }
            stream.Position = originalPosRef;

            foreach (var signature in signatures)
            {
                bool match = true;
                for (int i = 0; i < signature.Length; i++)
                {
                    if (headerBytes[i] != signature[i])
                    {
                        match = false;
                        break;
                    }
                }
                if (match) return true;
            }
            return false;
        }
    }
}
