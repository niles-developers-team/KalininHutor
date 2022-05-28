namespace KalininHutor.Domain.Booking;

public class BookingRoomVariant : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public decimal Amount { get; protected set; }
    public ICollection<BookingBedType> BookingBedTypes { get; protected set; }

    public BookingRoomVariant() { }
}