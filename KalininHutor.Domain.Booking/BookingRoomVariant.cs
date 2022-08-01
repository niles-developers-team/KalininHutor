using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;

public class BookingRoomVariant : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid BookingId { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public decimal Amount { get; protected set; }
    public BedTypes BedType { get; protected set; }

    protected BookingRoomVariant() { }

    public BookingRoomVariant(Guid roomVariantId, Guid bookingId, decimal amount, BedTypes bedType)
    {
        if (roomVariantId == null || roomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор варианта номера.");

        if (bookingId == null || bookingId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор брони.");

        if (amount < 0)
            throw new ArgumentNullException("Цена за аренду номера не может быть отрицательной.");

        Id = Guid.NewGuid();
        RoomVariantId = roomVariantId;
        BookingId = bookingId;
        Amount = Amount;
        BedType = bedType;
    }
}