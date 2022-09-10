using Microsoft.AspNetCore.SignalR;

namespace KalininHutor.API.Hubs;

public class BookingHub : Hub
{
    public Task SendNewBookingNotificationToLandlord(Guid landlordId)
    {
        return Clients.User(landlordId.ToString()).SendAsync("123");
    }
}