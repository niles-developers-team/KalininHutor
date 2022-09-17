using System.Collections.Concurrent;
using KalininHutor.API.DTO;
using KalininHutor.API.Providers;
using Microsoft.AspNetCore.SignalR;

namespace KalininHutor.API.Hubs;

public class NotificationsHub : Hub
{
    public static readonly ConnectionMapping<Guid> Connections = new ConnectionMapping<Guid>();
    private readonly JwtUserProvider _jwtUserProvider;

    public NotificationsHub(JwtUserProvider jwtUserProvider)
    {
        _jwtUserProvider = jwtUserProvider;
    }

    public override Task OnConnectedAsync()
    {
        var userId = _jwtUserProvider.GetUserId();
        if (userId == null) return base.OnConnectedAsync();

        var connectionId = Context.ConnectionId;

        Connections.Add(userId.Value, connectionId);

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        Connections.Remove(Context.ConnectionId);

        return base.OnDisconnectedAsync(exception);
    }
}