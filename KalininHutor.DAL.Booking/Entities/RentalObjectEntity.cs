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
    private TimeSpan? _checkinTimeSpan;
    private TimeSpan? _checkoutTimeSpan;

    public Guid? LandlordId { get; set; }
    public string? SearchText { get; set; }
    internal TimeSpan? CheckinTimeSpan { get => _checkinTimeSpan; private set => _checkinTimeSpan = value; }
    internal TimeSpan? CheckoutTimeSpan { get => _checkoutTimeSpan; private set => _checkoutTimeSpan = value; }
    public TimeOnly? CheckinTime
    {
        get => _checkinTimeSpan.HasValue ? TimeOnly.FromTimeSpan(_checkinTimeSpan.Value) : null;
        protected set => _checkinTimeSpan = value?.ToTimeSpan();
    }
    public TimeOnly? CheckoutTime
    {
        get => _checkoutTimeSpan.HasValue ? TimeOnly.FromTimeSpan(_checkoutTimeSpan.Value) : null;
        protected set => _checkoutTimeSpan = value?.ToTimeSpan();
    }
}