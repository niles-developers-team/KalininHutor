using System.IO.Compression;
using System.Text;

namespace KalininHutor.API.Helpers;

///<summary> ZIP Архиватор </summary>
public static class GZIP
{
    ///<summary> Сжимает массив байтов </summary>
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

    public static byte[] ZipFromBase64(string srcBase64)
    {
        var bytes = Convert.FromBase64String(srcBase64);

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

    ///<summary> Сжимает строку в массив байтов </summary>
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

    ///<summary> Распаковывает массив байтов </summary>
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

    ///<summary> Разжимает массив байтов в строку </summary>
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

    ///<summary> Разжимает массив байтов в строку </summary>
    public static string UnzipToStringBase64(byte[] src)
    {
        using (var msi = new MemoryStream(src))
        using (var gs = new GZipStream(msi, CompressionMode.Decompress))
        using (var mso = new MemoryStream())
        {
            gs.CopyTo(mso);
            return Convert.ToBase64String(mso.ToArray());
        }
    }
}