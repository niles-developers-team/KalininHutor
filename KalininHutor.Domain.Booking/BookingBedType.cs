using KalininHutor.Domain.BillBoard.Enums;

namespace KalininHutor.Domain.BillBoard;

public class BookingBedType : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public BedTypes BedType { get; protected set; }
    public int Count { get; protected set; }
}