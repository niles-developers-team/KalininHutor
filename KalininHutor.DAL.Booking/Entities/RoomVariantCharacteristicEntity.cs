namespace KalininHutor.DAL.Booking;

public class RoomVariantCharacteristicEntity
{
    public Guid Id { get; set; }
    public Guid RoomVariantId { get; set; }
    public Guid RoomCharacteristicId { get; set; }
    public string RoomCharacteristicName { get; set; } = string.Empty;
    public decimal Price { get; set; }

    public RoomCharacteristicEntity RoomCharacteristic { get; set; }
}

public class RoomVariantCharacteristicSearchOptions
{
    public Guid? RoomVariantId { get; set; }

    public IReadOnlyList<Guid>? RoomsVariantsIds { get; set; }
}