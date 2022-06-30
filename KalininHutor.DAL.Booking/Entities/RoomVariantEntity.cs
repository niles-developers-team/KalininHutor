namespace KalininHutor.DAL.Booking;

///<symmary> Вариант номера объекта аренды </summary>
public class RoomVariantEntity
{
    ///<symmary> Идентификатор варинта номера объекта аренды </summary>
    public Guid Id { get; protected set; }
    ///<symmary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
    ///<symmary> Название </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<symmary> Описание </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<symmary> Цена за номер </summary>
    public decimal Price { get; protected set; }
    ///<symmary> Длина варианта номера </summary>
    public double Width { get; protected set; }
    ///<symmary> Ширина варианта номера </summary>
    public double Length { get; protected set; }
    ///<symmary> Максимально человек в номере </summary>
    public int MaxPersonsCount { get; protected set; }
    ///<symmary> Период бесплатной отмены </summary>
    public int? FreeCancellationPeriod { get; protected set; }
    ///<symmary> Вариант оплаты </summary>
    public int PaymentOption { get; protected set; }
    ///<symmary> Всего номеров </summary>
    public int Count { get; protected set; }
    ///<symmary> Всего номеров свободно </summary>
    public int FreeCount { get; protected set; }

    public List<RoomVariantBedTypeEntity> BedTypes { get; protected set; } = new List<RoomVariantBedTypeEntity>();
    public List<RoomVariantCharacteristicEntity> Characteristics {get; protected set;} = new List<RoomVariantCharacteristicEntity>();
}

public class RoomVariantSearchOptions
{
    public Guid? RentalObjectId { get; set; }
    public bool IncludeBedTypes { get; set; }
}