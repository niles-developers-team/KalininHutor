namespace KalininHutor.Domain.Booking;

public class BookingRoomVariant : IEntity<Guid>
{
    protected HashSet<BookingBedType>? _bookingBedTypes;

    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public decimal Amount { get; protected set; }
    public IReadOnlyList<BookingBedType>? BookingBedTypes { get => _bookingBedTypes?.ToList(); protected set => _bookingBedTypes = value?.ToHashSet(); }

    protected BookingRoomVariant() { }

    public BookingRoomVariant(Guid roomVariantId, decimal amount)
    {
        if(roomVariantId == null || roomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор варианта номера.");

        if(amount < 0)
            throw new ArgumentNullException("Цена за аренду номера не может быть отрицательной.");

        RoomVariantId = roomVariantId;
        Amount = Amount;
    }
}