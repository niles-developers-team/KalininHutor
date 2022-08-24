namespace KalininHutor.API.DTO;

///<summary> Модель чтения варинта номера </summary>
public class RoomVariantDTO
{
    ///<summary> Идентификатор варинта номера объекта аренды </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
    ///<summary> Название </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<summary> Описание </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<summary> Цена </summary>
    public decimal Price { get; protected set; }
    ///<summary> Ширина варианта номера </summary>
    public double Width { get; protected set; }
    ///<summary> Длина варианта номера </summary>
    public double Length { get; protected set; }
    ///<summary> Максимально человек в номере </summary>
    public int MaxPersonsCount { get; protected set; }
    ///<summary> Период бесплатной отмены </summary>
    public int? FreeCancellationPeriod { get; protected set; }
    ///<summary> Вариант оплаты </summary>
    public int PaymentOption { get; protected set; }
    ///<summary> Всего номеров </summary>
    public int Count { get; protected set; }
    ///<summary> Всего номеров свободно </summary>
    public int FreeCount { get; protected set; }

    ///<summary> Доступные типы кроватей варианта номера </summary>
    public IReadOnlyList<RoomVariantBedTypeDTO> BedTypes { get; set; } = new List<RoomVariantBedTypeDTO>();
    ///<summary> Доступные сервисы и услуги варианта номера </summary>
    public IReadOnlyList<RoomVariantCharacteristicDTO> Characteristics { get; set; } = new List<RoomVariantCharacteristicDTO>();
}