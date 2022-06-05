using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RoomVariantBedType : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public BedTypes BedType { get; protected set; }
    public double? Width { get; protected set; }
    public double? Length { get; protected set; }
    public int MaxInRoom { get; protected set; }

    protected RoomVariantBedType() { }

    public RoomVariantBedType(Guid roomVariantId, BedTypes bedType, double? width, double? length)
    {
        Id = Guid.NewGuid();

        if (roomVariantId == null || roomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор варианта номера.");

        if ((width.HasValue && !length.HasValue) || (!width.HasValue && length.HasValue) || 
            (width.HasValue && width < 0) || (length.HasValue && length < 0))
            throw new ArgumentOutOfRangeException("Размер кровати должен быть больше 0.");

        RoomVariantId = roomVariantId;
        BedType = bedType;
        Width = width;
        Length = length;
    }
}