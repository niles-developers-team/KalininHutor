namespace KalininHutor.DAL.Booking;

public class BookingEntity
{
    public Guid Id { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public int AdultCount { get; protected set; }
    public int ChildCount { get; protected set; }
    public DateOnly CheckinDate { get; protected set; }
    public DateOnly CheckoutDate { get; protected set; }
    public decimal Total { get; protected set; }
}