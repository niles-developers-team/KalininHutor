
using KalininHutor.API.DTO;
using KalininHutor.API.Hubs;
using Microsoft.AspNetCore.SignalR;

public interface INotificationInformer
{
    Task ReceiveNotification(NotificationDTO notification);
}

public class NotificationInformer : INotificationInformer
{
    private readonly IHubContext<NotificationsHub> _hubContext;

    public NotificationInformer(IHubContext<NotificationsHub> hubContext) => _hubContext = hubContext;

    public async Task ReceiveNotification(NotificationDTO notification)
    {
        await Send(notification.UserId, "ReceiveNotification", notification);
    }


    private async Task Send(Guid personId, string method, params object[] args) =>
        await Task.WhenAll(Clients(personId).Select(client => client.SendCoreAsync(method, args)).ToArray());
    private IEnumerable<IClientProxy> Clients(Guid personId) => NotificationsHub.Connections.GetConnections(personId).Select(id => _hubContext.Clients.Client(id));
}