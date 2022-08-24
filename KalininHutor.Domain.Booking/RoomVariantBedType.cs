using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RoomVariantBedType : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public BedTypes BedType { get; protected set; }
    public double? Width { get; protected set; }
    public double? Length { get; protected set; }

    protected RoomVariantBedType() { }

    public RoomVariantBedType(Guid roomVariantId, BedTypes bedType, double? width, double? length, int maxInRoom)
    {
        Id = Guid.NewGuid();

        if (roomVariantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор варианта номера.");

        RoomVariantId = roomVariantId;
        BedType = bedType;

        SetSize(width, length);
    }

    private void CheckSize(double? width, double? length)
    {
        if ((width.HasValue && !length.HasValue) || (!width.HasValue && length.HasValue) || 
            (width.HasValue && width < 0) || (length.HasValue && length < 0))
            throw new ArgumentOutOfRangeException("Размер кровати должен быть больше 0.");
    }

    public void SetSize(double? width, double? length)
    {
        CheckSize(width, length);
        Width = width;
        Length = length;
    }
}