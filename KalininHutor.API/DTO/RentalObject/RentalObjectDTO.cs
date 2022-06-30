namespace KalininHutor.API.DTO;

///<summary> Модель чтения объекта аренды </summary>
public class RentalObjectDTO
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор владельца </summary>
    public Guid LandlordId { get; set; }
    ///<summary> Название объекта аренды  </summary>
    public string Name { get; protected set; } = string.Empty;
    public string Address { get; protected set; } = string.Empty;
    ///<summary> Описание объекта аренды </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<summary> Время заезда объекта аренды </summary>
    public TimeOnly CheckinTime { get; protected set; }
    ///<summary> Время отъезда объекта аренды </summary>
    public TimeOnly CheckoutTime { get; protected set; }
}