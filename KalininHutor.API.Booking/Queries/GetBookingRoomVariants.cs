using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

internal class GetBookingRoomVariantsHandler : IRequestHandler<GetBookingRoomVariantsQuery, IEnumerable<GetBookingRoomVariantsResponse>>
{
    private readonly BookingRoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingRoomVariantsHandler(BookingRoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<GetBookingRoomVariantsResponse>> Handle(GetBookingRoomVariantsQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingRoomVariantSearchOptions>(request));
        return result.Select(_mapper.Map<GetBookingRoomVariantsResponse>).ToList();
    }
}

///<summary> Очередь получения забронированных вариантов кроватей в номера </summary>
public class GetBookingRoomVariantsQuery : IRequest<IEnumerable<GetBookingRoomVariantsResponse>>
{
    public Guid? Id { get; protected set; }

    public Guid? BookingId { get; protected set; }
}

///<summary> Модель чтения брони </summary>
public class GetBookingRoomVariantsResponse
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public Guid BookingId { get; protected set; }
    public decimal Amount { get; protected set; }
}