namespace KalininHutor.API.DTO;

///<summary> Модель чтения забронированных вариантов кроватей в номерах </summary>
public class BookingBedTypeDTO
{
    ///<summary> Идентификатор выбранной кровати в номер </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор выбранного номера </summary>
    public Guid BookingRoomVariantId { get; protected set; }
    ///<summary> Выбранный тип кровати </summary>
    public Guid BedTypeId { get; protected set; }
    ///<summary> Количество кроватей выбранного типа </summary>
    public int Count { get; protected set; }
}