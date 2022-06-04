namespace KalininHutor.DAL.Booking;

public class RoomVariantCharacteristicEntity
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public Guid RoomCharacteristicId { get; protected set; }
    public decimal Price { get; protected set; }
}