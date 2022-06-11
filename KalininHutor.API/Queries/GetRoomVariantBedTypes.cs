using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Queries;

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

///<summary> Очередь получения вариантов кроватей в номере </summary>
public class GetRoomVariantBedTypesQuery : IRequest<IEnumerable<GetRoomVariantBedTypesResponse>>
{
    ///<summary> Идентификатор варианта кровати </summary>
    public Guid? Id { get; set; }
    ///<summary> Идентификатор номера </summary>
    public Guid? RoomVariantId { get; set; }
}

///<summary> Модель чтения вариантов кроватей в номере </summary>
public class GetRoomVariantBedTypesResponse
{
    ///<summary> Идентификатор варианта кровати </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор номера </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> Тип кровати </summary>
    public BedTypes BedType { get; protected set; }
    ///<summary> Ширина кровати </summary>
    public double? Width { get; protected set; }
    ///<summary> Длина кровати </summary>
    public double? Length { get; protected set; }
    ///<summary> Максимально в комнате </summary>
    public int MaxInRoom { get; protected set; }
}