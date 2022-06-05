using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

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
    public Guid? Id { get; set; }
    public Guid? TenantId { get; set; }
    public string? SearchText { get; set; }
    public DateOnly CheckinDate { get; set; }
    public DateOnly CheckoutDate { get; set; }
}

///<summary> Модель чтения брони </summary>
public class GetBookingsResponse
{
    public Guid Id { get; protected set; }
    public Guid TenantId { get; protected set; }
    public Guid RentalObjectId { get; protected set; }
    public int AdultCount { get; protected set; }
    public int ChildCount { get; protected set; }
    public decimal Total { get; protected set; }
    public DateOnly CheckinDate { get; set; }
    public DateOnly CheckoutDate { get; set; }
}