using KalininHutor.Domain.Booking.Enums;
using KalininHutor.Domain.Identity;

namespace KalininHutor.Domain.Booking;

public class Booking : IEntity<Guid>
{
    private HashSet<BookingRoomVariant>? _roomVariants;

    public Guid Id { get; protected set; }
    public Guid? TenantId { get; protected set; }
    public long Number { get; protected set; }
    public string TenantName { get; protected set; }
    public string TenantLastname { get; protected set; }
    public string TenantEmail { get; protected set; }
    public string TenantPhone { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public int AdultCount { get; protected set; }
    public int ChildCount { get; protected set; }
    public DateOnly CreatedAt { get; protected set; }
    public DateOnly CheckinDate { get; protected set; }
    public DateOnly CheckoutDate { get; protected set; }
    public decimal Total { get; protected set; }
    public BookingStatuses Status { get; protected set; } = BookingStatuses.Draft;

    public IReadOnlyList<BookingRoomVariant>? RoomVariants { get => _roomVariants?.ToList(); protected set => _roomVariants = value?.ToHashSet(); }

    protected Booking() { }

    public Booking(Guid rentalObjectId, User tenant, int adultCount, int childCount, DateOnly checkinDate, DateOnly checkoutDate)
    {
        if (rentalObjectId == Guid.Empty)
            throw new ArgumentNullException("Не указан идентификатор объекта аренды.");

        if (tenant == null)
            throw new ArgumentNullException("Не указан идентификатор арендатора.");

        CheckVisitorsCount(adultCount, childCount);
        CheckBookingPeriod(checkinDate, checkoutDate);
        CheckTenant(tenant);

        Id = Guid.NewGuid();
        RentalObjectId = rentalObjectId;
        TenantId = tenant.Id;
        TenantEmail = tenant.Email;
        TenantLastname = tenant.Lastname;
        TenantName = tenant.Name;
        TenantPhone = tenant.PhoneNumber;

        AdultCount = adultCount;
        ChildCount = childCount;
        CheckinDate = checkinDate;
        CheckoutDate = checkoutDate;

        CreatedAt = DateOnly.FromDateTime(DateTime.Now);
        Status = BookingStatuses.Created;

        _roomVariants = new HashSet<BookingRoomVariant>();
    }

    public void SetStatus(BookingStatuses status)
    {
        if (Status == BookingStatuses.Closed || Status == BookingStatuses.Rejected)
            throw new ArgumentException("Невозможно изменить статус закрытой или отмененной брони");

        if (Status != BookingStatuses.Draft && status == BookingStatuses.Draft)
            throw new ArgumentException("Невозомжно перевести созданную бронь в черновик");

        Status = status;
    }

    public void SetRoomVariants(IEnumerable<BookingRoomVariant> roomVariants)
    {
        if (roomVariants == null)
            throw new ArgumentNullException("Выбранные варианты номеров бронирования не были загружены");
        _roomVariants = roomVariants.ToHashSet();
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

    private void CheckTenant(User tenant)
    {
        if (tenant.Id == Guid.Empty)
            throw new ArgumentNullException("Не указан арендатор");
        if (string.IsNullOrEmpty(tenant.Name) ||
            string.IsNullOrEmpty(tenant.Lastname) ||
            string.IsNullOrEmpty(tenant.Email))
            throw new ArgumentNullException("Не указаны данные арендатора");
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

    public void AddRoomVariant(Guid roomVariantId, decimal amount, BedTypes bedType)
    {
        var roomVariant = new BookingRoomVariant(roomVariantId, Id, amount, bedType);

        _roomVariants.Add(roomVariant);
    }
}