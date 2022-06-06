using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class UpdateRoomVariantBedTypeHandler : IRequestHandler<UpdateRoomVariantBedTypeRequest, Unit>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(UpdateRoomVariantBedTypeRequest request, CancellationToken cancellationToken)
    {
        var RoomVariantBedTypes = await _repository.Get(new RoomVariantBedTypeSearchOptions { Id = request.Id });
        var entity = _mapper.Map<RoomVariantBedType>(RoomVariantBedTypes.SingleOrDefault());
        entity.SetSize(request.Width, request.Length, request.MaxInRoom);
        await _repository.Update(_mapper.Map<RoomVariantBedTypeEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запрос обновления варианта кровати </summary>
public class UpdateRoomVariantBedTypeRequest : IRequest<Unit>
{
    ///<summary> Идентификатор варианта кровати </summary>
    public Guid Id { get; protected set; }
    ///<summary> Ширина кровати </summary>
    public double? Width { get; protected set; }
    ///<summary> Длина кровати </summary>
    public double? Length { get; protected set; }
    ///<summary> Максимально в комнате </summary>
    public int MaxInRoom { get; protected set; }
}