namespace KalininHutor.API.DTO;

///<summary> Модель чтения брони </summary>
public class BookingDTO
{
    ///<summary> Идентификатор брони </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор арендатора </summary>
    public Guid TenantId { get; protected set; }
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
    ///<summary> Количество взрослых </summary>
    public int AdultCount { get; protected set; }
    ///<summary> Количество детей </summary>
    public int ChildCount { get; protected set; }
    ///<summary> Всего за бронь (руб.) </summary>
    public decimal Total { get; protected set; }
    ///<summary> Дата заезда </summary>
    public DateOnly CheckinDate { get; set; }
    ///<summary> Дата отъезда </summary>
    public DateOnly CheckoutDate { get; set; }
}