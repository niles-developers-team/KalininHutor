namespace KalininHutor.DAL.Booking;

///<summary> Справочник харакетристик варианта номера </summary>
public class RoomCharacteristic
{
    ///<summary> Идентификатор характеристики </summary>
    public Guid Id { get; protected set; }
    ///<summary> Название характеристики </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<summary> Описание харакетирстики </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<summary> Тип (Зона) харакетистики </summary>
    public int Type { get; protected set; }
}