using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.DTO;

///<summary> Модель чтения характеристики варианта номера </summary>
public class RoomCharacteristicDTO
{
    ///<summary> Идентификатор характеристики </summary>
    public Guid Id { get; set; }
    ///<summary> Название характеристики </summary>
    public string Name { get; set; } = string.Empty;
    ///<summary> Описание харакетирстики </summary>
    public string Description { get; set; } = string.Empty;
    ///<summary> Тип (Зона) харакетистики </summary>
    public CharacteristicTypes Type { get; set; }
}