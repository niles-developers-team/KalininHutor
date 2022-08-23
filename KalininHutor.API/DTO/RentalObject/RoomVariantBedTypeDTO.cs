using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.DTO;

///<summary> Модель чтения вариантов кроватей в номере </summary>
public class RoomVariantBedTypeDTO
{
    ///<summary> Идентификатор варианта кровати </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор номера </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> Тип кровати </summary>
    public BedTypes BedType { get; protected set; }
    ///<summary> Ширина кровати </summary>
    public double? Width { get; protected set; }
    ///<summary> Длина кровати </summary>
    public double? Length { get; protected set; }
}