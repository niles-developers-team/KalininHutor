namespace KalininHutor.DAL.Booking;

public class RoomVariantCharacteristicEntity
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public Guid RoomCharacteristicId { get; protected set; }
    public string RoomCharacteristicName { get; protected set; } = string.Empty;
    public decimal Price { get; protected set; }
}

public class RoomVariantCharacteristicSearchOptions
{
    public Guid? RoomVariantId { get; set; }

    public IReadOnlyList<Guid>? RoomsVariantsIds { get; set; }
}