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
        Id = Guid.NewGuid();

        if(roomVariantId == null || roomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор варианта номера.");

        if(roomCharacteristicId == null || roomCharacteristicId == Guid.Empty)
        throw new ArgumentNullException("Не указан идентификатор харакеристики.");

        RoomVariantId = roomVariantId;
        RoomCharacteristicId = roomCharacteristicId;
        Price = price;
    }
}