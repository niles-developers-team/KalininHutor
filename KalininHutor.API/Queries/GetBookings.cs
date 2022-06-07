using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetBookingsHandler : IRequestHandler<GetBookingsQuery, IEnumerable<GetBookingsResponse>>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingsHandler(BookingRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<GetBookingsResponse>> Handle(GetBookingsQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingSearchOptions>(request));
        return result.Select(_mapper.Map<GetBookingsResponse>).ToList();
    }
}

///<summary> Очередь получения брони </summary>
public class GetBookingsQuery : IRequest<IEnumerable<GetBookingsResponse>>
{
    ///<summary> Идентификатор брони </summary>
    public Guid? Id { get; set; }
    ///<summary> Идентификатор арендатора </summary>
    public Guid? TenantId { get; set; }
    ///<summary> Поисковая строка </summary>
    public string? SearchText { get; set; }
    ///<summary> Дата заезда </summary>
    public DateOnly CheckinDate { get; set; }
    ///<summary> Дата отъезда </summary>
    public DateOnly CheckoutDate { get; set; }
}

///<summary> Модель чтения брони </summary>
public class GetBookingsResponse
{
    ///<summary> Идентификатор брони </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор арендатора </summary>
    public Guid TenantId { get; protected set; }
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
    ///<summary> Количество взрослых </summary>
    public int AdultCount { get; protected set; }
    ///<summary> Количество детей </summary>
    public int ChildCount { get; protected set; }
    ///<summary> Всего за бронь (руб.) </summary>
    public decimal Total { get; protected set; }
    ///<summary> Дата заезда </summary>
    public DateOnly CheckinDate { get; set; }
    ///<summary> Дата отъезда </summary>
    public DateOnly CheckoutDate { get; set; }
}