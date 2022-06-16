using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

using DomainRoomVariantBedType = Domain.Booking.RoomVariantBedType;

internal class UpdateRoomVariantBedTypeHandler : IRequestHandler<RoomVariantBedTypeRequests.UpdateRequest, Unit>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RoomVariantBedTypeRequests.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<DomainRoomVariantBedType>(await _repository.Get(request.Id));
        entity.SetSize(request.Width, request.Length, request.MaxInRoom);
        await _repository.Update(_mapper.Map<RoomVariantBedTypeEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запросы и очереди вариантов кроватей </summary>
public partial class RoomVariantBedTypeRequests
{
    ///<summary> Запрос обновления варианта кровати </summary>
    public class UpdateRequest : IRequest<Unit>
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
}