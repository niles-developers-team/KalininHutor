using System.ComponentModel;

namespace KalininHutor.Domain.Booking.Enums;

public enum BookingStatuses
{
    ///<summary> Черновик </summary>
    [Description("Черновик")]
    Draft,
    ///<summary> Новая бронь </summary>
    [Description("Новая бронь")]
    Created,
    ///<summary> Бронь подтверждена </summary>
    [Description("Бронь подтверждена")]
    Approved,
    ///<summary> Бронь закрыта </summary>
    [Description("Бронь закрыта")]
    Closed,
    ///<summary> Бронь отменена </summary>
    [Description("Бронь отменена")]
    Rejected
}