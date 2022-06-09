namespace KalininHutor.Domain.Booking;

public class BookingBedType : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid BookingRoomVariantId { get; protected set; }
    public Guid BedTypeId { get; protected set; }
    public int Count { get; protected set; }

    protected BookingBedType() { }

    public BookingBedType(Guid bookingRoomVariantId, Guid bedTypeId, int count)
    {
        if(bookingRoomVariantId == null || bookingRoomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор бронируемого номера.");

        if (count < 0)
            throw new ArgumentOutOfRangeException("Количество бронируемых кроватей не может быть меньше 0.");

        Id = Guid.NewGuid();
        BookingRoomVariantId = bookingRoomVariantId;
        BedTypeId = bedTypeId;
        Count = count;
    }
}