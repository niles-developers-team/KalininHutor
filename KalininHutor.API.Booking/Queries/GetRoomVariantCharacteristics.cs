using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

internal class GetRoomVariantCharacteristicsHandler : IRequestHandler<GetRoomVariantCharacteristicsQuery, IEnumerable<GetRoomVariantCharacteristicsResponse>>
{
    private readonly RoomVariantCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomVariantCharacteristicsHandler(RoomVariantCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<GetRoomVariantCharacteristicsResponse>> Handle(GetRoomVariantCharacteristicsQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomVariantCharacteristicSearchOptions>(request));
        return result.Select(_mapper.Map<GetRoomVariantCharacteristicsResponse>).ToList();
    }
}

///<summary> Очередь получения брони </summary>
public class GetRoomVariantCharacteristicsQuery : IRequest<IEnumerable<GetRoomVariantCharacteristicsResponse>>
{
    public Guid? Id { get; set; }
    public Guid? RoomVariantId { get; set; }
}

///<summary> Модель чтения брони </summary>
public class GetRoomVariantCharacteristicsResponse
{
    public Guid Id { get; protected set; }
    public Guid RoomVariantId { get; protected set; }
    public Guid RoomCharacteristicId { get; protected set; }
    public decimal Price { get; protected set; }
}