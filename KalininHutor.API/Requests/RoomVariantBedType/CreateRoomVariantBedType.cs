using MediatR;
using AutoMapper;

using KalininHutor.Domain.Booking;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Booking.Requests;

internal class CreateRoomVariantBedTypeHandler : IRequestHandler<CreateRoomVariantBedTypeRequest, Guid>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateRoomVariantBedTypeRequest request, CancellationToken cancellationToken)
    {
        var RoomVariantBedType = new RoomVariantBedType(request.RoomVariantId, request.BedType, request.Width, request.Length, request.MaxInRoom);
        await _repository.Create(_mapper.Map<RoomVariantBedTypeEntity>(RoomVariantBedType));

        return RoomVariantBedType.Id;
    }
}

///<summary> Запрос создания варианта кровати номера </summary>
public class CreateRoomVariantBedTypeRequest : IRequest<Guid>
{
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