using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.DTO;

///<summary> Модель чтения брони </summary>
public class RoomCharacteristicDTO
{
    ///<summary> Идентификатор характеристики </summary>
    public Guid Id { get; protected set; }
    ///<summary> Название характеристики </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<summary> Описание харакетирстики </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<summary> Тип (Зона) харакетистики </summary>
    public CharacteristicTypes Type { get; protected set; }
}