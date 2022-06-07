using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Queries;

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

///<summary> Очередь получения забронированных вариантов кроватей в номерах </summary>
public class GetBookingBedTypesQuery : IRequest<IEnumerable<GetBookingBedTypesResponse>>
{
    ///<summary> Идентификатор выбранной кровати в номер  </summary>
    public Guid? Id { get; protected set; }
    ///<summary> Идентификатор выбранного номера </summary>
    public Guid? BookingRoomVariantId { get; protected set; }
}

///<summary> Модель чтения забронированных вариантов кроватей в номерах </summary>
public class GetBookingBedTypesResponse
{
    ///<summary> Идентификатор выбранной кровати в номер </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор выбранного номера </summary>
    public Guid BookingRoomVariantId { get; protected set; }
    ///<summary> Выбранный тип кровати </summary>
    public BedTypes BedType { get; protected set; }
    ///<summary> Количество кроватей выбранного типа </summary>
    public int Count { get; protected set; }
}