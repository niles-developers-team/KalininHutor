namespace KalininHutor.DAL.Booking;

///<summary> Модель БД возможных кроватей в номере </summary>
public class RoomVariantBedTypeEntity
{
    ///<summary> Идентификатор </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор варианта номера </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> Тип кровати </summary>
    public int BedType { get; protected set; }
    ///<summary> Ширина кровати </summary>
    public double? Width { get; protected set; }
    ///<summary> Длина кровати </summary>
    public double? Length { get; protected set; }
    ///<summary> Максимально в комнате </summary>
    public int MaxInRoom { get; protected set; }

    protected RoomVariantBedTypeEntity() { }

    public RoomVariantBedTypeEntity(Guid roomVariantId, int bedType, double? width, double? length)
    {
        RoomVariantId = roomVariantId;
        BedType = bedType;
        Width = width;
        Length = length;
    }
}