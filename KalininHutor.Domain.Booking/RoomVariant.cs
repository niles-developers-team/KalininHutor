using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RoomVariant : IEntity<Guid>
{
    private HashSet<FileObject>? _photos;
    private HashSet<RoomVariantBedType>? _bedTypes;
    private HashSet<RoomVariantCharacteristic>? _characteristics;

    public Guid Id { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public string Name { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;
    public decimal PriceForAdult { get; protected set; }
    public decimal PriceForChild { get; protected set; }
    public double Width { get; protected set; }
    public double Length { get; protected set; }
    public int MaxPersonsCount { get; protected set; }
    public bool IsFreeCancellationEnabled { get; protected set; }
    public int? FreeCancellationPeriod { get; protected set; }
    public PaymentOptions PaymentOption { get; protected set; }
    public int Amount { get; protected set; }
    public int FreeAmount { get; protected set; }
    public IReadOnlyList<FileObject>? Photos { get => _photos?.ToList(); protected set => _photos = value?.ToHashSet(); }
    public IReadOnlyList<RoomVariantBedType>? BedTypes { get => _bedTypes?.ToList(); protected set => _bedTypes = value?.ToHashSet(); }
    public IReadOnlyList<RoomVariantCharacteristic>? Characteristics { get => _characteristics?.ToList(); protected set => _characteristics = value?.ToHashSet(); }

    public double Size => Width * Length;

    public string SizeText => $"{Width}x{Length}";

    protected RoomVariant() { }

    public RoomVariant(Guid rentalObjectId, string name, string description,
                       decimal priceForAdult, decimal priceForChild, int maxPersonsCount,
                       int width, int length, bool isFreeCancellationEnabled, int freeCancelationPeriod,
                       PaymentOptions paymentOption, int amount, int freeAmount)
    {
        RentalObjectId = rentalObjectId;
        Name = name;
        Description = description;
        PriceForAdult = priceForAdult;
        PriceForChild = priceForChild;
        MaxPersonsCount = maxPersonsCount;
        Width = width;
        Length = length;
        IsFreeCancellationEnabled = isFreeCancellationEnabled;
        FreeCancellationPeriod = freeCancelationPeriod;
        PaymentOption = paymentOption;
        Amount = amount;
        FreeAmount = freeAmount;
    }

    public RoomVariantCharacteristic AddCharacteristic(RoomCharacteristic characteristic, decimal? price)
    {
        if (_characteristics == null)
            throw new MissingFieldException("Харакеристики варианта номера не были загружены");

        if (_characteristics.Any(o => o.RoomCharacteristicId == characteristic.Id))
            throw new ApplicationException($"Для варианта номера уже добавлена услуга {characteristic.Name}");

        var roomCharacteristic = new RoomVariantCharacteristic(Id, characteristic.Id, price);

        _characteristics.Add(roomCharacteristic);

        return roomCharacteristic;
    }

    public RoomVariantBedType AddBedType(BedTypes bedType, double? width, double? length, int? maxInRoom)
    {
        if (_bedTypes == null)
            throw new MissingFieldException("Варианты кроватей номера не были загружены");

        if (!maxInRoom.HasValue)
            maxInRoom = GetMaxBedInRoom(width, length);

        var roomBedType = new RoomVariantBedType(Id, bedType, width, length);
        _bedTypes.Add(roomBedType);

        return roomBedType;
    }

    public void AddPhotos(ICollection<FileObject> photos)
    {
        if (_photos == null)
            throw new MissingFieldException("Фотографии номера не были загружены");

        foreach (var photo in photos)
            _photos.Add(photo);
    }

    public bool IsAvailableForBooking(int adultCount, int childsCount)
    {
        int totalCount = adultCount + childsCount;
        if (totalCount > MaxPersonsCount)
            throw new ApplicationException("Превышено допустимое количество человек в номере.");

        return true;
    }

    private int GetMaxBedInRoom(double? width, double? length)
    {
        if (!width.HasValue || width == 0 ||
            !length.HasValue || length == 0)
            return 0;

        double bedSize = width.Value * length.Value;

        return (int)(Size / bedSize);
    }
}