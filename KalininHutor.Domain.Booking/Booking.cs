namespace KalininHutor.Domain.Booking;

public class Booking : IEntity<Guid>
{
    private HashSet<BookingRoomVariant>? _roomVariants;

    public Guid Id { get; protected set; }
    public Guid TenantId { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public int AdultCount { get; protected set; }
    public int ChildCount { get; protected set; }
    public DateOnly CheckinDate { get; protected set; }
    public DateOnly CheckoutDate { get; protected set; }
    public decimal Total { get; protected set; }

    public IReadOnlyList<BookingRoomVariant>? RoomVariants { get => _roomVariants?.ToList(); protected set => _roomVariants = value?.ToHashSet(); }

    protected Booking() { }

    public Booking(Guid rentalObjectId, Guid tenantId, int adultCount, int childCount, DateOnly checkinDate, DateOnly checkoutDate)
    {
        if (rentalObjectId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор объекта аренды.");

        if (tenantId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор арендатора.");

        CheckVisitorsCount(adultCount, childCount);
        CheckBookingPeriod(checkinDate, checkoutDate);

        Id = Guid.NewGuid();
        RentalObjectId = rentalObjectId;
        TenantId = tenantId;
        AdultCount = adultCount;
        ChildCount = childCount;
        CheckinDate = checkinDate;
        CheckoutDate = checkoutDate;
    }

    public void SetVisitorsCount(int adultCount, int childCount)
    {
        CheckVisitorsCount(adultCount, childCount);

        AdultCount = adultCount;
        ChildCount = childCount;
    }

    public void SetBookingDates(DateOnly checkinDate, DateOnly checkoutDate)
    {
        CheckBookingPeriod(checkinDate, checkoutDate);

        CheckinDate = checkinDate;
        CheckoutDate = checkoutDate;
    }

    private void CheckVisitorsCount(int adultCount, int childCount)
    {
        if (adultCount <= 0)
            throw new ArgumentOutOfRangeException("Количество взрослых посетителей должно быть больше 0.");

        if (childCount < 0)
            throw new ArgumentOutOfRangeException("Количество взрослых посетителей должно быть больше или равно 0.");
    }

    private void CheckBookingPeriod(DateOnly checkinDate, DateOnly checkoutDate)
    {
        if (checkoutDate < checkinDate)
            throw new ArgumentOutOfRangeException("Неправильный промежуток дат заезда и отъезда.");

        if (checkinDate < DateOnly.FromDateTime(DateTime.Now) || checkoutDate < DateOnly.FromDateTime(DateTime.Now))
            throw new ArgumentOutOfRangeException("Дата бронирования не может быть в прошлом.");
    }

    public void AddRoomVariant(Guid roomVariantId, decimal amount, IReadOnlyList<BookingBedType> bedTypes)
    {
        var roomVariant = new BookingRoomVariant(roomVariantId, Id, amount);

        foreach (var bookingBedType in bedTypes)
            roomVariant.AddBedTypes(bookingBedType.BedTypeId, bookingBedType.Count);

        _roomVariants.Add(roomVariant);
    }
}