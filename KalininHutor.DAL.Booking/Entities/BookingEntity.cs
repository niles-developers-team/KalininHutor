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
    public DateTime CheckinDateTime { get => _checkinDateTime; private set => _checkinDateTime = value; }
    public DateTime CheckoutDateTime { get => _checkoutDateTime; private set => _checkoutDateTime = value; }
}

public class BookingSearchOptions
{
    private DateTime _checkinDateTime;
    private DateTime _checkoutDateTime;

    public Guid? Id { get; set; }
    public string? SearchText { get; set; }
    public DateOnly CheckinDate { get => DateOnly.FromDateTime(_checkinDateTime); protected set => _checkinDateTime = value.ToDateTime(new TimeOnly()); }
    public DateOnly CheckoutDate { get => DateOnly.FromDateTime(_checkoutDateTime); protected set => _checkoutDateTime = value.ToDateTime(new TimeOnly()); }
    public DateTime CheckinDateTime { get => _checkinDateTime; private set => _checkinDateTime = value; }
    public DateTime CheckoutDateTime { get => _checkoutDateTime; private set => _checkoutDateTime = value; }
}