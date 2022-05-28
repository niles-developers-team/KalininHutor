namespace KalininHutor.Domain.BillBoard;

public class Booking : IEntity<Guid>
{
    private HashSet<BookingRoomVariant>? roomVariants;

    public Guid Id { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public int AdultCount { get; protected set; }
    public int ChildCount { get; protected set; }
    public DateOnly CheckinDate { get; protected set; }
    public DateOnly CheckoutDate { get; protected set; }
    public decimal Total { get; protected set; }

    public IReadOnlyList<BookingRoomVariant>? RoomVariants { get => roomVariants?.ToList(); protected set => roomVariants = value?.ToHashSet(); }

    protected Booking() { }

    public Booking(Guid rentalObjectId, int adultCount, int childCount, DateOnly checkinDate, DateOnly checkoutDate)
    {
        RentalObjectId = rentalObjectId;
        AdultCount = adultCount;
        ChildCount = childCount;
        CheckinDate = checkinDate;
        CheckoutDate = checkoutDate;
    }
}