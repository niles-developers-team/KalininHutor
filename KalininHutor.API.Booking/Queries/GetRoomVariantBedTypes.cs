using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

internal class GetRoomVariantBedTypesHandler : IRequestHandler<GetRoomVariantBedTypesQuery, IEnumerable<GetRoomVariantBedTypesResponse>>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomVariantBedTypesHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<GetRoomVariantBedTypesResponse>> Handle(GetRoomVariantBedTypesQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomVariantBedTypeSearchOptions>(request));
        return result.Select(_mapper.Map<GetRoomVariantBedTypesResponse>).ToList();
    }
}

///<summary> Очередь получения забронированных вариантов кроватей в номера </summary>
public class GetRoomVariantBedTypesQuery : IRequest<IEnumerable<GetRoomVariantBedTypesResponse>>
{
    public Guid? Id { get; set; }
    public Guid? RoomVariantId { get; set; }
}

///<summary> Модель чтения брони </summary>
public class GetRoomVariantBedTypesResponse
{
    ///<summary> Идентификатор </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор варианта номера </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> Тип кровати </summary>
    public int BedType { get; protected set; }
    ///<summary> Ширина кровати </summary>
    public double? Width { get; protected set; }
    ///<summary> Длина кровати </summary>
    public double? Length { get; protected set; }
    ///<summary> Максимально в комнате </summary>
    public int MaxInRoom { get; protected set; }
}