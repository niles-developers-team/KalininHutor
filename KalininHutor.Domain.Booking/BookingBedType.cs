using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;

public class BookingBedType : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public BedTypes BedType { get; protected set; }
    public int Count { get; protected set; }

    protected BookingBedType() { }

    public BookingBedType(BedTypes bedType, int count)
    {
        if(count < 0)
            throw new ArgumentOutOfRangeException("Количество бронируемых кроватей не может быть меньше 0.");

        Id = Guid.NewGuid();
        BedType = bedType;
        Count = count;
    }
}