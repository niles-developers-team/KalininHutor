namespace KalininHutor.API.DTO;

///<summary> Модель чтения характеристики варианта номера </summary>
public class RoomVariantCharacteristicDTO
{
    ///<summary> Идентификатор характеристики номера </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор номера </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> Идентификатор характеристики </summary>
    public Guid RoomCharacteristicId { get; protected set; }
    ///<summary> Название характеристики комнаты </summary>
    public string RoomCharacteristicName { get; protected set; } = string.Empty;
    public RoomCharacteristicDTO RoomCharacteristic { get; protected set; }
    ///<summary> Цена за услугу или удобство </summary>
    public decimal Price { get; protected set; }
}