using System.IO.Compression;
using System.Text;

namespace KalininHutor.API.Helpers;

public static class GZIP
{
    public static byte[] Zip(byte[] src)
    {
        using (var msi = new MemoryStream(src))
        using (var mso = new MemoryStream())
        {
            //стрим gzip нужно закрыть перед тем, как писать в массив
            using (var gs = new GZipStream(mso, CompressionLevel.Optimal))
            {
                msi.CopyTo(gs);

            }
            return mso.ToArray();
        }
    }

    public static byte[] ZipFromString(string src)
    {
        var bytes = Encoding.Unicode.GetBytes(src);

        using (var msi = new MemoryStream(bytes))
        using (var mso = new MemoryStream())
        {
            //стрим gzip нужно закрыть перед тем, как писать в массив
            using (var gs = new GZipStream(mso, CompressionLevel.Optimal))
            {
                msi.CopyTo(gs);

            }
            return mso.ToArray();
        }
    }

    public static byte[] Unzip(byte[] src)
    {
        using (var msi = new MemoryStream(src))
        using (var gs = new GZipStream(msi, CompressionMode.Decompress))
        using (var mso = new MemoryStream())
        {
            gs.CopyTo(mso);
            return mso.ToArray();
        }
    }

    public static string UnzipToString(byte[] src)
    {
        using (var msi = new MemoryStream(src))
        using (var gs = new GZipStream(msi, CompressionMode.Decompress))
        using (var mso = new MemoryStream())
        {
            gs.CopyTo(mso);
            return Encoding.Unicode.GetString(mso.ToArray());
        }
    }
}