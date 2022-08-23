using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.DTO;

///<summary> Модель чтения брони </summary>
public class BookingDTO
{
    ///<summary> Идентификатор брони </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
    ///<summary> Номер брони </summary>
    public long Number { get; protected set; }
    ///<summary> Дата создания брони </summary>
    public DateOnly CreatedAt { get; protected set; }
    ///<summary> Количество взрослых </summary>
    public int AdultCount { get; protected set; }
    ///<summary> Количество детей </summary>
    public int ChildCount { get; protected set; }
    ///<summary> Всего за бронь (руб.) </summary>
    public decimal Total { get; protected set; }
    ///<summary> Дата заезда </summary>
    public DateOnly CheckinDate { get; protected set; }
    ///<summary> Дата отъезда </summary>
    public DateOnly CheckoutDate { get; protected set; }
    ///<summary> Статус брони </summary>
    public BookingStatuses Status { get; protected set; } = BookingStatuses.Draft;

    ///<summary> Арендатор </summary>
    public UserDTO Tenant { get; set; }
    ///<summary> Объект аренды </summary>
    public RentalObjectDTO RentalObject { get; set; }
    ///<summary> Бронируемые варианты номеров </summary>
    public IEnumerable<BookingRoomVariantDTO> RoomVariants { get; set; }
}