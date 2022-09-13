using KalininHutor.Domain;

namespace KalininHutor.API.DTO;

public class NotificationDTO
{
    public Guid Id { get; protected set; }
    public Guid UserId { get; protected set; }
    public string Message { get; protected set; }
    public string Variant { get; protected set; }
}