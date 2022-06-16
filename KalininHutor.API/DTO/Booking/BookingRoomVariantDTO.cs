namespace KalininHutor.API.DTO;

///<summary> Модель чтения выбранного варианта номера </summary>
public class BookingRoomVariantDTO
{
    ///<summary> Идентификатор выбранного номера </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор варианта номера </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> Идентификатор брони </summary>
    public Guid BookingId { get; protected set; }
    ///<summary> Всего за номер (руб.) </summary>
    public decimal Amount { get; protected set; }
}