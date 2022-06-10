using System.ComponentModel;

namespace KalininHutor.Domain.Booking.Enums
{
    ///<summary>Возможные способов оплаты на объектах аренды</summary>
    public enum PaymentOptions
    {
        [Description("Можно оплатить онлайн")]
        ///<summary>Можно оплатить онлайн</summary>
        Online,

        [Description("Оплата на месте только наличными")]
        ///<summary>Оплата на месте только наличными</summary>
        CashOnTheSpot,
        
        [Description("Оплата на месте картой или наличными")]
        ///<summary>Оплата на месте картой или наличными</summary>
        ByCardOrCashOnTheSpot
    }
}