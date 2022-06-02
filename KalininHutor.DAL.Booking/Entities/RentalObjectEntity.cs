namespace KalininHutor.DAL.Booking;

public class RentalObjectEntity
{
    private TimeSpan _checkinTimeSpan;
    private TimeSpan _checkoutTimeSpan;

    public Guid Id { get; protected set; }
    public Guid OwnerId { get; protected set; }
    public string Name { get; protected set; }
    public string Description { get; protected set; }
    public TimeSpan CheckinTimeSpan { get => _checkinTimeSpan; protected set => _checkinTimeSpan = value; }
    public TimeSpan CheckoutTimeSpan { get => _checkoutTimeSpan; protected set => _checkoutTimeSpan = value; }
    public TimeOnly CheckinTime { get => TimeOnly.FromTimeSpan(_checkinTimeSpan); protected set => _checkinTimeSpan = value.ToTimeSpan(); }
    public TimeOnly CheckoutTime { get => TimeOnly.FromTimeSpan(_checkoutTimeSpan); protected set => _checkoutTimeSpan = value.ToTimeSpan(); }
}

public class RentalObjectSearchOptions
{
    public Guid Id { get; set; }
    public string SearchText { get; set; }
    public TimeOnly CheckinTime { get; set; }
    public TimeOnly CheckoutTime { get; set; }
}