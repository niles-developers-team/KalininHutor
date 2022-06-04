namespace KalininHutor.DAL.Booking;

public class BookingRoomVariantEntity
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public Guid BookingId { get; protected set; }
    public decimal Amount { get; protected set; }
}

public class BookingRoomVariantSearchOptions
{
    public Guid? Id { get; protected set; }

    public Guid? BookingId { get; protected set; }
}