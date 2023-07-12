namespace KalininHutor.DAL.Booking;

public class RentalObjectEntity : IHideableEntity
{
    private TimeSpan _checkinTimeSpan;
    private TimeSpan _checkoutTimeSpan;

    public Guid Id { get; protected set; }
    public Guid LandlordId { get; protected set; }
    public string Name { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;
    public string Address { get; protected set; } = string.Empty;
    internal TimeSpan CheckinTimeSpan { get => _checkinTimeSpan; private set => _checkinTimeSpan = value; }
    internal TimeSpan CheckoutTimeSpan { get => _checkoutTimeSpan; private set => _checkoutTimeSpan = value; }
    public TimeOnly CheckinTime { get => TimeOnly.FromTimeSpan(_checkinTimeSpan); protected set => _checkinTimeSpan = value.ToTimeSpan(); }
    public TimeOnly CheckoutTime { get => TimeOnly.FromTimeSpan(_checkoutTimeSpan); protected set => _checkoutTimeSpan = value.ToTimeSpan(); }
    ///<summary> Объект аренды скрыт или нет? </summary>
    public bool IsHidden { get; protected set; }

    public List<RentalObjectFileObjectEntity> FileObjects { get; protected set; } = new List<RentalObjectFileObjectEntity>();
}

public class RentalObjectFileObjectEntity : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public Guid FileObjectId { get; protected set; }
    public int SortOrder { get; protected set; }
}

public class RentalObjectSearchOptions
{
    public Guid? Id { get; set; }
    public Guid? LandlordId { get; set; }
    public string? SearchText { get; set; }
    internal TimeSpan? CheckinTimeSpan { get => CheckinTime.HasValue ? CheckinTime.Value.ToTimeSpan() : null; }
    internal TimeSpan? CheckoutTimeSpan { get => CheckoutTime.HasValue ? CheckoutTime.Value.ToTimeSpan() : null; }
    public TimeOnly? CheckinTime { get; protected set; }
    public TimeOnly? CheckoutTime { get; protected set; }
    ///<summary> Количество взрослых </summary>
    public int? AdultsCount { get; set; }
    ///<summary> Количество детей </summary>
    public int? ChildsCount { get; set; }
    ///<summary> Количество комнат </summary>
    public int? RoomsCount { get; set; }
    ///<summary> Минимальная цена </summary>
    public decimal? MinPrice { get; set; }
    ///<summary> Максимальная цена </summary>
    public decimal? MaxPrice { get; set; }
    public bool ShowHidden { get; set; }

    public IReadOnlyList<Guid> SelectedCharacteristicsIds { get; set; } = new List<Guid>();
    public IReadOnlyList<Guid> Ids { get; set; } = new List<Guid>();
}