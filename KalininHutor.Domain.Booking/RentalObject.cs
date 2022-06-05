using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RentalObject : IEntity<Guid>
{
    private HashSet<FileObject>? _photos;
    private HashSet<RoomVariant>? _roomVariants;
    private HashSet<Booking>? _bookings;

    public Guid Id { get; protected set; }

    public Guid LandlordId { get; protected set; }

    public string Address { get; protected set; } = string.Empty;

    public string Name { get; protected set; } = string.Empty;

    public string Description { get; protected set; } = string.Empty;

    public TimeOnly? CheckinTime { get; protected set; }

    public TimeOnly? CheckoutTime { get; protected set; }

    public IReadOnlyList<FileObject>? Photos { get => _photos?.ToList(); protected set => _photos = value?.ToHashSet(); }

    public IReadOnlyList<RoomVariant>? RoomVariants { get => _roomVariants?.ToList(); protected set => _roomVariants = value?.ToHashSet(); }

    public IReadOnlyList<Booking>? Bookings { get => _bookings?.ToList(); protected set => _bookings = value?.ToHashSet(); }

    protected RentalObject() { }

    public RentalObject(string? name, string? description, string? address,
                        TimeOnly? checkinTime, TimeOnly? checkoutTime, Guid ownerId)
    {
        if(string.IsNullOrEmpty(name))
            throw new ApplicationException("Не указано название.");

        if (string.IsNullOrEmpty(description))
            throw new ApplicationException("Не указано описание.");

        if (string.IsNullOrEmpty(address))
            throw new ApplicationException("Не указан адрес.");

        if((checkinTime.HasValue && !checkoutTime.HasValue) ||
            !checkinTime.HasValue && checkoutTime.HasValue)
            throw new ArgumentException("Время заезда и отъезда должны быть указаны.");

        Id = Guid.NewGuid();

        Name = name;
        Description = description;
        Address = address;
        CheckinTime = checkinTime;
        CheckoutTime = checkoutTime;
        LandlordId = ownerId;
    }

    public void SetInfo(string name, string description)
    {
        Name = name;
        Description = description;
    }

    public void SetCheckTime(TimeOnly checkinTime, TimeOnly checkoutTime)
    {
        CheckinTime = checkinTime;
        CheckoutTime = checkoutTime;
    }

    public void AddPhoto(FileObject photo)
    {
        if (_photos == null)
            throw new MissingFieldException("Фотографии объекта аренды не были загружены");

        _photos.Add(photo);
    }

    public RoomVariant CreateRoomVariant(string name, string description, decimal priceForAdult,
                                        decimal priceForChild, int maxPersonsCount, int width, int length, bool isFreeCancellationEnabled,
                                        int freeCancelationPeriod, PaymentOptions paymentOption, int amount, int freeAmount)
    {
        if (_roomVariants == null)
            throw new MissingFieldException("Варианты номеров объекта аренды не были загружены");

        var roomVariant = new RoomVariant(Id, name, description, priceForAdult, priceForChild, maxPersonsCount, width, length, isFreeCancellationEnabled, freeCancelationPeriod, paymentOption, amount, freeAmount);
        _roomVariants.Add(roomVariant);

        return roomVariant;
    }

    public BookingRoomVariant CreateBooking(DateOnly checkInDate, DateOnly checkOutDate, int adultCount, int childsCount, IEnumerable<Guid> roomVariantsIds, IEnumerable<BedTypes> bedTypes)
    {
        if (_roomVariants == null)
            throw new MissingFieldException("Варианты номеров объекта аренды не были загружены");

        //foreach ()
        //IsRoomVariantAvailableForBooking(checkInDate, checkOutDate, adultCount, childsCount, roo)

        return null;
    }

    private void IsRoomVariantAvailableForBooking(DateOnly checkInDate, DateOnly checkOutDate, int adultCount, int childsCount, Guid roomVariantId)
    {
        var roomVariant = _roomVariants.SingleOrDefault(o => o.Id == roomVariantId);
        if (roomVariant == null)
            throw new ApplicationException("Выбран неизвестный вариант номера.");

        var bookedRoomVariants = _bookings.Where(o => o.CheckinDate >= checkInDate || o.CheckoutDate <= o.CheckoutDate).SelectMany(o => o.RoomVariants).Where(o => o.RoomVariantId == roomVariantId).Distinct();
        if (bookedRoomVariants.Count() == _roomVariants.Sum(o => o.Amount))
            throw new ApplicationException("Нет свободного варианта номера на указанные даты.");


    }
}