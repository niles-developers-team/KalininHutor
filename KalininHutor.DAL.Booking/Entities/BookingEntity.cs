namespace KalininHutor.DAL.Booking;

public class BookingEntity
{
    private DateTime _checkinDateTime;
    private DateTime _checkoutDateTime;

    public Guid Id { get; protected set; }
    public Guid TenantId { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public int AdultCount { get; protected set; }
    public int ChildCount { get; protected set; }
    public decimal Total { get; protected set; }
    public DateOnly CheckinDate { get => DateOnly.FromDateTime(_checkinDateTime); protected set => _checkinDateTime = value.ToDateTime(new TimeOnly()); }
    public DateOnly CheckoutDate { get => DateOnly.FromDateTime(_checkoutDateTime); protected set => _checkoutDateTime = value.ToDateTime(new TimeOnly()); }
    internal DateTime CheckinDateTime { get => _checkinDateTime; private set => _checkinDateTime = value; }
    internal DateTime CheckoutDateTime { get => _checkoutDateTime; private set => _checkoutDateTime = value; }
}

public class BookingSearchOptions
{
    public Guid? Id { get; set; }
    public Guid? RentalObjectId { get; set; }
    public Guid? TenantId { get; set; }
    public string? SearchText { get; set; }
    public DateOnly? CheckinDate { get; protected set; }
    public DateOnly? CheckoutDate { get; protected set; }
    internal DateTime? CheckinDateTime { get => CheckinDate.HasValue ? CheckinDate.Value.ToDateTime(new TimeOnly()) : null; }
    internal DateTime? CheckoutDateTime { get => CheckoutDate.HasValue ? CheckoutDate.Value.ToDateTime(new TimeOnly()) : null; }
}