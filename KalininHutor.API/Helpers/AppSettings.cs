namespace KalininHutor.API.Helpers;

///<summary> Настройки приложения </summary>
public class AppSettings
{
    ///<summary> Секрет </summary>
    public string Secret { get; protected set; } = string.Empty;
    ///<summary> Строки подключения </summary>
    public ConnectionStrings ConnectionStrings { get; protected set; } = new ConnectionStrings();
}

///<summary> Строки подключения </summary>
public class ConnectionStrings
{
    ///<summary> Строка подключения к базе Postgres </summary>
    public string Postgres { get; protected set; } = string.Empty;
}