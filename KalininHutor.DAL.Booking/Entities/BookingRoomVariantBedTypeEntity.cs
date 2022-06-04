namespace KalininHutor.DAL.Booking;

public class BookingRoomVariantBedTypeEntity
{
    public Guid Id { get; protected set; }
    public Guid BookingRoomVariant { get; protected set; }
    public int BedType { get; protected set; }
    public int Count { get; protected set; }
}