using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

internal class GetBookingBedTypesHandler : IRequestHandler<GetBookingBedTypesQuery, IEnumerable<GetBookingBedTypesResponse>>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingBedTypesHandler(BookingRoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<GetBookingBedTypesResponse>> Handle(GetBookingBedTypesQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingRoomVariantBedTypeSearchOptions>(request));
        return result.Select(_mapper.Map<GetBookingBedTypesResponse>).ToList();
    }
}

///<summary> Очередь получения забронированных вариантов кроватей в номера </summary>
public class GetBookingBedTypesQuery : IRequest<IEnumerable<GetBookingBedTypesResponse>>
{
    public Guid? Id { get; protected set; }
    public Guid? BookingRoomVariant { get; protected set; }
}

///<summary> Модель чтения брони </summary>
public class GetBookingBedTypesResponse
{
    public Guid Id { get; protected set; }
    public Guid BookingRoomVariant { get; protected set; }
    public BedTypes BedType { get; protected set; }
    public int Count { get; protected set; }
}