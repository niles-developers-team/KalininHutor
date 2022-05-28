using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RoomCharacteristic : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public string Name { get; protected set; }
    public string Description { get; protected set; }
    public CharacteristicTypes Type { get; protected set; }

    protected RoomCharacteristic() { }

    public RoomCharacteristic(string name, string description, CharacteristicTypes type)
    {
        Name = name;
        Description = description;
        Type = type;
    }
}