using System.Net;

namespace MustafaGuler.Core.Utilities.Security
{
    public static class NetworkValidator
    {
        public static bool IsPrivateOrLocalhost(string host)
        {
            if (host == "localhost" || host == "127.0.0.1" || host == "::1") return true;

            try
            {
                var ips = Dns.GetHostAddresses(host);
                foreach (var ip in ips)
                {
                    if (IPAddress.IsLoopback(ip)) return true;
                    if (ip.ToString() == "0.0.0.0" || ip.ToString() == "::") return true;

                    byte[] bytes = ip.GetAddressBytes();
                    if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                    {
                        if (bytes[0] == 10) return true;
                        if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) return true;
                        if (bytes[0] == 192 && bytes[1] == 168) return true;
                        if (bytes[0] == 169 && bytes[1] == 254) return true;
                    }
                    else if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6)
                    {
                        if (ip.IsIPv6LinkLocal) return true;
                        if (ip.IsIPv6SiteLocal) return true;

                        // Unique Local Addresses
                        if ((bytes[0] & 0xFE) == 0xFC) return true;

                        if (ip.IsIPv4MappedToIPv6)
                        {
                            var ipv4 = ip.MapToIPv4();
                            byte[] v4bytes = ipv4.GetAddressBytes();
                            if (v4bytes[0] == 10) return true;
                            if (v4bytes[0] == 172 && v4bytes[1] >= 16 && v4bytes[1] <= 31) return true;
                            if (v4bytes[0] == 192 && v4bytes[1] == 168) return true;
                            if (v4bytes[0] == 169 && v4bytes[1] == 254) return true;
                        }
                    }
                }
                return false;
            }
            catch
            {
                return true; // Block if DNS fails 
            }
        }
    }
}
