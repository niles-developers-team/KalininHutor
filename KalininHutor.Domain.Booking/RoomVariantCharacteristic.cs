namespace KalininHutor.Domain.Booking;
public class RoomVariantCharacteristic : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public Guid RoomCharacteristicId { get; protected set; }
    public decimal? Price { get; protected set; }

    protected RoomVariantCharacteristic() { }

    public RoomVariantCharacteristic(Guid roomVariantId, Guid roomCharacteristicId, decimal? price)
    {
        RoomVariantId = roomVariantId;
        RoomCharacteristicId = roomCharacteristicId;
        Price = price;
    }
}