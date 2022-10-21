using MediatR;
using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Commands;

///<summary> Запросы и очереди характеристик вариантов номеров </summary>
public partial class RoomVariantCharacteristicCommands
{
    ///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
        ///<summary> Идентификатор характеристики </summary>
        public RoomCharacteristic Characteristic { get; set; }
        ///<summary> Цена за услугу или удобство </summary>
        public decimal? Price { get; set; }
    }
}