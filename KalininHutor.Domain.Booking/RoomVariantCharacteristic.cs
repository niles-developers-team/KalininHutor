namespace KalininHutor.Domain.Booking;
public class RoomVariantCharacteristic : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public Guid RoomCharacteristicId { get; protected set; }
    public string RoomCharacteristicName { get; protected set; }
    public decimal? Price { get; protected set; }

    protected RoomVariantCharacteristic() { }

    internal RoomVariantCharacteristic(Guid roomVariantId, Guid roomCharacteristicId, decimal? price)
    {
        Id = Guid.NewGuid();

        if (roomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор варианта номера.");

        if (roomCharacteristicId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор харакеристики.");

        RoomVariantId = roomVariantId;
        RoomCharacteristicId = roomCharacteristicId;
        SetPrice(price);
    }

    public void SetPrice(decimal? price)
    {
        if (price.HasValue && price.Value <= 0)
            throw new ArgumentOutOfRangeException("Цена за услугу должна быть больше 0.");

        Price = price;
    }
}