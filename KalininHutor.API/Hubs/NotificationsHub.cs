using KalininHutor.API.Providers;
using Microsoft.AspNetCore.SignalR;

namespace KalininHutor.API.Hubs;

///<summary> Хаб подключенных пользователей </summary>
public class NotificationsHub : Hub
{
    ///<summary> Коллекция подключений </summary>
    public static readonly ConnectionMapping<Guid> Connections = new ConnectionMapping<Guid>();
    private readonly JwtUserProvider _jwtUserProvider;

    ///<summary>  </summary>
    public NotificationsHub(JwtUserProvider jwtUserProvider)
    {
        _jwtUserProvider = jwtUserProvider;
    }

    ///<summary> Обработчитк подключения пользователя </summary>
    public override Task OnConnectedAsync()
    {
        var userId = _jwtUserProvider.GetUserId();
        if (userId == null) return base.OnConnectedAsync();

        var connectionId = Context.ConnectionId;

        Connections.Add(userId.Value, connectionId);

        return base.OnConnectedAsync();
    }

    ///<summary>Обработчик отключения пользователя </summary>
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (string.IsNullOrEmpty(Context.ConnectionId))
            return base.OnDisconnectedAsync(new ArgumentNullException(nameof(Context.ConnectionId)));

        Connections.Remove(Context.ConnectionId);

        return base.OnDisconnectedAsync(exception);
    }
}