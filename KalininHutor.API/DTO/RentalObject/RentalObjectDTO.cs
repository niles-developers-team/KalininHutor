namespace KalininHutor.API.DTO;

///<summary> Модель чтения объекта аренды </summary>
public class RentalObjectDTO
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор владельца </summary>
    public Guid LandlordId { get; protected set; }
    ///<summary> Название объекта аренды  </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<summary> Адрес объекта аренды </summary>
    public string Address { get; protected set; } = string.Empty;
    ///<summary> Описание объекта аренды </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<summary> Время заезда объекта аренды </summary>
    public TimeOnly CheckinTime { get; protected set; }
    ///<summary> Время отъезда объекта аренды </summary>
    public TimeOnly CheckoutTime { get; protected set; }

    ///<summary> Лучшие предложения </summary>
    public RentalObjectBestDemandDTO? BestDemand { get; set; }
    ///<summary> Варианты номеров </summary>
    public IEnumerable<RoomVariantDTO> RoomVariants { get; set; } = new List<RoomVariantDTO>();
    ///<summary> Фотографии объекта аренды </summary>
    public IEnumerable<FileObjectDTO> Photos { get; set; } = new List<FileObjectDTO>();
    ///<summary> Отзывы </summary>
    public IEnumerable<FeedbackDTO> Feedback { get; set; } = new List<FeedbackDTO>();
    ///<summary> Рейтинг объекта аренды </summary>
    public float Rate { get; set; }
}

///<summary> Лучшее предложение по фильтру </summary>
public class RentalObjectBestDemandDTO
{
    ///<summary> Индентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; set; }
    ///<summary> Количество взрослых </summary>
    public int? AdultsCount { get; protected set; }
    ///<summary> Количество детей </summary>
    public int? ChildsCount { get; protected set; }
    ///<summary> Количество ночей </summary>
    public int NightsCount { get; protected set; }
    ///<summary> Цена за предложение </summary>
    public decimal Price { get; protected set; }

    ///<summary> Конструктор </summary>
    public RentalObjectBestDemandDTO(Guid rentalObjectId, int? adultsCount, int? childsCount, int nightsCount, decimal price)
    {
        RentalObjectId = rentalObjectId;
        AdultsCount = adultsCount;
        ChildsCount = childsCount;
        NightsCount = nightsCount;
        Price = price;
    }
}