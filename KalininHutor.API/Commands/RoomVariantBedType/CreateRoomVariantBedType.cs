using MediatR;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Commands;

///<summary> Запросы и очереди вариантов кроватей </summary>
public partial class RoomVariantBedTypeCommands
{
    ///<summary> Запрос создания варианта кровати номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
        ///<summary> Тип кровати </summary>
        public BedTypes BedType { get; set; }
        ///<summary> Ширина кровати </summary>
        public double? Width { get; set; }
        ///<summary> Длина кровати </summary>
        public double? Length { get; set; }
        ///<summary> Максимально в комнате </summary>
        public int MaxInRoom { get; set; }
    }
}