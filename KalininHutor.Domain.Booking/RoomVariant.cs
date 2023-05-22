using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RoomVariant : IEntity<Guid>, IEntityWithPhotos
{
    private HashSet<FileObject>? _photos = new HashSet<FileObject>();
    private HashSet<RoomVariantBedType>? _bedTypes = new HashSet<RoomVariantBedType>();
    private HashSet<RoomVariantCharacteristic>? _characteristics = new HashSet<RoomVariantCharacteristic>();

    public Guid Id { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public string Name { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;
    public decimal Price { get; protected set; }
    public double Width { get; protected set; }
    public double Length { get; protected set; }
    public int MaxPersonsCount { get; protected set; }
    public int? FreeCancellationPeriod { get; protected set; }
    public PaymentOptions PaymentOption { get; protected set; }
    public int Count { get; protected set; }
    public int FreeCount { get; protected set; }
    public IReadOnlyList<FileObject> Photos { get => _photos?.ToList() ?? throw new NullReferenceException(nameof(Photos)); protected set => _photos = value.ToHashSet(); }
    public IReadOnlyList<RoomVariantBedType> BedTypes { get => _bedTypes?.ToList() ?? throw new NullReferenceException(nameof(BedTypes)); protected set => _bedTypes = value.ToHashSet(); }
    public IReadOnlyList<RoomVariantCharacteristic> Characteristics { get => _characteristics?.ToList() ?? throw new NullReferenceException(nameof(Characteristics)); protected set => _characteristics = value.ToHashSet(); }

    public double Size => Width * Length;

    public string SizeText => $"{Width}x{Length}";

    protected RoomVariant() { }

    internal RoomVariant(Guid rentalObjectId, string name, string description,
                       decimal price, int maxPersonsCount,
                       double width, double length, int? freeCancelationPeriod,
                       PaymentOptions paymentOption, int count, int freeCount)
    {
        Id = Guid.NewGuid();

        if (rentalObjectId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор объекта аренды.");

        SetInfo(name, description, paymentOption);
        SetPriceAndLimit(price, maxPersonsCount);
        SetSize(width, length);
        SetFreeCancelationPeriod(freeCancelationPeriod);
        SetCounts(count, freeCount);

        RentalObjectId = rentalObjectId;

        _photos = new HashSet<FileObject>();
        _bedTypes = new HashSet<RoomVariantBedType>();
        _characteristics = new HashSet<RoomVariantCharacteristic>();
    }

    public void SetInfo(string name, string description, PaymentOptions paymentOption)
    {
        if (string.IsNullOrEmpty(name))
            throw new ArgumentNullException("Не указано название варианта номера.");

        if (string.IsNullOrEmpty(description))
            throw new ArgumentNullException("Не указано описание варианта номера.");

        Name = name;
        Description = description;
        PaymentOption = paymentOption;
    }

    public void SetPriceAndLimit(decimal price, int maxPersonsCount)
    {
        if (price < 0)
            throw new ArgumentOutOfRangeException("Цены не могут быть отрицательными.");

        if (maxPersonsCount <= 0)
            throw new ArgumentOutOfRangeException("Количество посетителей в номере не может быть меньше 0.");

        Price = price;
        MaxPersonsCount = maxPersonsCount;
    }

    public void SetSize(double width, double length)
    {
        if (width <= 0 || length <= 0)
            throw new ArgumentOutOfRangeException("Размер номера не может быть меньше 0.");

        Width = width;
        Length = length;
    }

    public void SetCounts(int count, int freeCount)
    {

        if (count < 0 || freeCount <= 0)
            throw new ArgumentOutOfRangeException("Количество номеров не может быть меньше 0.");

        if (freeCount > count)
            throw new ArgumentOutOfRangeException("Количество свободных номеров не может быть больше всего количества номеров.");

        Count = count;
        FreeCount = freeCount;
    }

    public void SetFreeCancelationPeriod(int? freeCancellationPeriod)
    {
        if (freeCancellationPeriod.HasValue && freeCancellationPeriod.Value < 0)
            throw new ArgumentOutOfRangeException("Период бесплатной отмены не может быть отрицательным");

        FreeCancellationPeriod = freeCancellationPeriod;
    }

    public RoomVariantCharacteristic CreateCharacteristic(RoomCharacteristic characteristic, decimal? price)
    {
        if (_characteristics.Any(o => o.RoomCharacteristicId == characteristic.Id))
            throw new ApplicationException($"Для варианта номера уже добавлена услуга {characteristic.Name}");

        var roomCharacteristic = new RoomVariantCharacteristic(Id, characteristic.Id, price);

        _characteristics.Add(roomCharacteristic);

        return roomCharacteristic;
    }

    public RoomVariantBedType CreateBedType(BedTypes bedType, double? width, double? length, int? maxInRoom)
    {
        if (!maxInRoom.HasValue)
            maxInRoom = GetMaxBedInRoom(width, length);

        var roomBedType = new RoomVariantBedType(Id, bedType, width, length, maxInRoom.Value);
        _bedTypes.Add(roomBedType);

        return roomBedType;
    }

    public void SetPhotos(ICollection<FileObject> photos) => _photos = photos.ToHashSet();

    public bool IsAvailableForBooking(int adultCount, int childsCount)
    {
        int totalCount = adultCount + childsCount;
        if (totalCount > MaxPersonsCount)
            throw new ApplicationException("Превышено допустимое количество человек в номере.");

        return true;
    }

    public decimal CalculateAmount(int nightsCount, int roomsCount)
    {
        return Price * nightsCount * roomsCount;
    }

    private int GetMaxBedInRoom(double? width, double? length)
    {
        if (!width.HasValue || width == 0 ||
            !length.HasValue || length == 0)
            return 0;

        double bedSize = width.Value * length.Value;

        return (int)(Size / bedSize);
    }

    public void CreatePhoto(string name, string extension, string body, uint sortOrder)
     => _photos.Add(new FileObject(name, extension, body, sortOrder, Id));
}