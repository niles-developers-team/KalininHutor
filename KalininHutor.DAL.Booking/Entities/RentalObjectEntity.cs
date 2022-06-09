namespace KalininHutor.DAL.Booking;

public class RentalObjectEntity
{
    private TimeSpan _checkinTimeSpan;
    private TimeSpan _checkoutTimeSpan;

    public Guid Id { get; protected set; }
    public Guid LandlordId { get; protected set; }
    public string Name { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;
    public string Address { get; protected set; } = string.Empty;
    internal TimeSpan CheckinTimeSpan { get => _checkinTimeSpan; private set => _checkinTimeSpan = value; }
    internal TimeSpan CheckoutTimeSpan { get => _checkoutTimeSpan; private set => _checkoutTimeSpan = value; }
    public TimeOnly CheckinTime { get => TimeOnly.FromTimeSpan(_checkinTimeSpan); protected set => _checkinTimeSpan = value.ToTimeSpan(); }
    public TimeOnly CheckoutTime { get => TimeOnly.FromTimeSpan(_checkoutTimeSpan); protected set => _checkoutTimeSpan = value.ToTimeSpan(); }
}

public class RentalObjectSearchOptions
{
    public Guid? LandlordId { get; set; }
    public string? SearchText { get; set; }
    internal TimeSpan? CheckinTimeSpan { get => CheckinTime.HasValue ? CheckinTime.Value.ToTimeSpan() : null; }
    internal TimeSpan? CheckoutTimeSpan { get => CheckoutTime.HasValue ? CheckoutTime.Value.ToTimeSpan() : null; }
    public TimeOnly? CheckinTime { get; protected set; }
    public TimeOnly? CheckoutTime { get; protected set; }
}