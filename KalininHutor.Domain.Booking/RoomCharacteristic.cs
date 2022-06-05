using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RoomCharacteristic : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public string Name { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;
    public CharacteristicTypes Type { get; protected set; }

    protected RoomCharacteristic() { }

    public RoomCharacteristic(string name, string description, CharacteristicTypes type)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Type = type;
    }

    private void CheckInfo(string name, string description)
    {
        if(string.IsNullOrEmpty(name))
            throw new ArgumentNullException("Не указано название характеристики номера.");
            
        if(string.IsNullOrEmpty(description))
            throw new ArgumentNullException("Не указано описание характеристики номера.");
    }
}