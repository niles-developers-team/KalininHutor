using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.Domain.Booking;
public class RentalObject : IEntity<Guid>, IEntityWithPhotos
{
    private HashSet<FileObject> _photos = new HashSet<FileObject>();
    private HashSet<RoomVariant> _roomVariants = new HashSet<RoomVariant>();
    private HashSet<Booking> _bookings = new HashSet<Booking>();
    private HashSet<Feedback> _feedback = new HashSet<Feedback>();

    public Guid Id { get; protected set; }

    public Guid LandlordId { get; protected set; }

    public string Address { get; protected set; } = string.Empty;

    public string Name { get; protected set; } = string.Empty;

    public string Description { get; protected set; } = string.Empty;

    public TimeOnly? CheckinTime { get; protected set; }

    public TimeOnly? CheckoutTime { get; protected set; }

    public IReadOnlyList<FileObject> Photos { get => _photos?.ToList() ?? throw new NullReferenceException(nameof(Photos)); protected set => _photos = value?.ToHashSet(); }

    public IEnumerable<RoomVariant> RoomVariants { get => _roomVariants; protected set => _roomVariants = value.ToHashSet(); }

    public IEnumerable<Booking> Bookings { get => _bookings; protected set => _bookings = value.ToHashSet(); }

    public IEnumerable<Feedback> Feedback { get => _feedback; protected set => _feedback = value.ToHashSet(); }

    public float Rate  => _feedback.Any() ? _feedback.Sum(o => o.Rate) / _feedback.Count() : 0;
    
    protected RentalObject() { }

    public RentalObject(string name, string description, string? address,
                        TimeOnly? checkinTime, TimeOnly? checkoutTime, Guid ownerId)
    {
        CheckInfo(name, description);

        if (string.IsNullOrEmpty(address))
            throw new ApplicationException("Не указан адрес.");

        if ((checkinTime.HasValue && !checkoutTime.HasValue) ||
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

    public void SetPhotos(ICollection<FileObject> photos) => _photos = photos.ToHashSet();

    public void SetRoomVariants(IReadOnlyList<RoomVariant> variants)
    {
        if (variants.Any(o => o.RentalObjectId != Id))
            throw new Exception("Некоторые варианты номера не принадлежат данному объекту аренды");

        _roomVariants = variants.ToHashSet();
    }

    public void SetBookings(IReadOnlyList<Booking> bookings)
    {
        if (bookings.Any(o => o.RentalObjectId != Id))
            throw new Exception("Некоторые варианты номера не принадлежат данному объекту аренды");

        _bookings = bookings.ToHashSet();
    }

    private void CheckInfo(string name, string description)
    {
        if (string.IsNullOrEmpty(name))
            throw new ApplicationException("Не указано название.");

        if (string.IsNullOrEmpty(description))
            throw new ApplicationException("Не указано описание.");
    }

    public void SetInfo(string name, string description, string address)
    {
        CheckInfo(name, description);
        Name = name;
        Description = description;
        Address = address;
    }

    public void SetCheckTime(TimeOnly checkinTime, TimeOnly checkoutTime)
    {
        CheckinTime = checkinTime;
        CheckoutTime = checkoutTime;
    }

    public void CreatePhoto(string name, string extension, string body, uint sortOrder)
    => _photos.Add(new FileObject(name, extension, body, sortOrder, Id));

    public RoomVariant CreateRoomVariant(string name, string description, decimal price,
                                        int maxPersonsCount, double width, double length,
                                        int? freeCancelationPeriod, PaymentOptions paymentOption, int amount, int freeAmount)
    {
        if (_roomVariants == null)
            throw new MissingFieldException("Варианты номеров объекта аренды не были загружены");

        var roomVariant = new RoomVariant(Id, name, description, price, maxPersonsCount, width, length, freeCancelationPeriod, paymentOption, amount, freeAmount);
        _roomVariants.Add(roomVariant);

        return roomVariant;
    }

    public Booking CreateBooking(Tenant tenant, DateOnly checkInDate, DateOnly checkOutDate,
                                 int adultCount, int childsCount, IReadOnlyList<BookingRoomVariant> bookingRoomVariants)
    {
        ValidateBookingRoomVariants(checkInDate, checkOutDate, adultCount, childsCount, bookingRoomVariants);

        var booking = new Booking(Id, tenant, adultCount, childsCount, checkInDate, checkOutDate);

        int nightsCount = (int)(checkOutDate.ToDateTime(TimeOnly.MaxValue) - checkInDate.ToDateTime(TimeOnly.MinValue)).TotalDays;

        foreach (var bookingRoomVariant in bookingRoomVariants)
        {
            var roomVariant = _roomVariants.SingleOrDefault(o => o.Id == bookingRoomVariant.RoomVariantId) ?? throw new Exception("Не найден вариант номера");
            booking.AddRoomVariant(bookingRoomVariant.RoomVariantId, bookingRoomVariant.RoomsCount, roomVariant.CalculateAmount(nightsCount, bookingRoomVariant.RoomsCount), bookingRoomVariant.BedType);
        }

        booking.CalculateTotal();

        return booking;
    }

    public Feedback CreateFeedback(string? comment, uint rate, Guid? userId, string? phomeNumber)
    {
        var feedback = new Feedback(Id, rate, comment, userId, phomeNumber);

        _feedback.Add(feedback);

        return feedback;
    }

    private void ValidateBookingRoomVariants(DateOnly checkInDate, DateOnly checkOutDate, int adultCount, int childsCount,
                                 IReadOnlyList<BookingRoomVariant> bookingRoomVariants)
    {
        if (_roomVariants == null)
            throw new MissingFieldException("Варианты номеров объекта аренды не были загружены");

        if (_bookings == null)
            throw new MissingFieldException("Брони объекта аренды не были загружены");

        var selectedRoomVariants = _roomVariants.Where(o => bookingRoomVariants.Any(brv => brv.RoomVariantId == o.Id));

        var visitorsSum = adultCount + childsCount;
        if (visitorsSum > selectedRoomVariants.Sum(o => o.MaxPersonsCount))
            throw new ApplicationException($"В выбранных номерах не поместится {visitorsSum} гостя.");

        foreach (var bookingRoomVariant in bookingRoomVariants)
        {
            CheckRoomVariantAvailableForBooking(checkInDate, checkOutDate, adultCount, childsCount, bookingRoomVariant);
        }
    }

    private void CheckRoomVariantAvailableForBooking(DateOnly checkInDate, DateOnly checkOutDate, int adultCount, int childsCount, BookingRoomVariant bookingRoomVariant)
    {
        var roomVariant = _roomVariants.SingleOrDefault(o => o.Id == bookingRoomVariant.RoomVariantId);
        if (roomVariant == null)
            throw new ApplicationException("Выбран неизвестный вариант номера.");

        var bookedRoomVariants = _bookings.Where(o => o.CheckinDate >= checkInDate || o.CheckoutDate <= o.CheckoutDate).SelectMany(o => o.RoomVariants).Where(o => o.RoomVariantId == bookingRoomVariant.RoomVariantId).Distinct();
        if (bookedRoomVariants.Count() == _roomVariants.Sum(o => o.Count))
            throw new ApplicationException("Нет свободного варианта номера на указанные даты.");
    }
}