namespace KalininHutor.Domain.Booking;

public class Tenant : IUser
{
    public string PhoneNumber { get; protected set; } = string.Empty;
    public string Name { get; protected set; } = string.Empty;
    public string Lastname { get; protected set; } = string.Empty;
    public string Email { get; protected set; } = string.Empty;

    public Guid Id { get; protected set; }
}