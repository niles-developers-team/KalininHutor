namespace KalininHutor.Domain.Booking;

public class BookingRoomVariant : IEntity<Guid>
{
    protected HashSet<BookingBedType>? _bookingBedTypes = new HashSet<BookingBedType>();

    public Guid Id { get; protected set; }
    public Guid BookingId { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public decimal Amount { get; protected set; }
    public IReadOnlyList<BookingBedType>? BookingBedTypes { get => _bookingBedTypes?.ToList(); protected set => _bookingBedTypes = value?.ToHashSet(); }

    protected BookingRoomVariant() { }

    public BookingRoomVariant(Guid roomVariantId, Guid bookingId, decimal amount)
    {
        if (roomVariantId == null || roomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор варианта номера.");

        if (bookingId == null || bookingId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор брони.");

        if (amount < 0)
            throw new ArgumentNullException("Цена за аренду номера не может быть отрицательной.");

        RoomVariantId = roomVariantId;
        BookingId = bookingId;
        Amount = Amount;
    }

    public void AddBedTypes(Guid bedTypeId, int count)
    {
        var bookingBedType = new BookingBedType(Id, bedTypeId, count);

        _bookingBedTypes.Add(bookingBedType);
    }
}