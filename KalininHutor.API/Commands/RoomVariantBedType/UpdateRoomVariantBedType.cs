using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class UpdateRoomVariantBedTypeHandler : IRequestHandler<RoomVariantBedTypeCommands.UpdateRequest, RoomVariantBedTypeDTO>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<RoomVariantBedTypeDTO> Handle(RoomVariantBedTypeCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<RoomVariantBedType>(await _repository.Get(request.Id));
        entity.SetSize(request.Width, request.Length);
        await _repository.Update(_mapper.Map<RoomVariantBedTypeEntity>(entity));
        return _mapper.Map<RoomVariantBedTypeDTO>(entity);
    }
}

///<summary> Запросы и очереди вариантов кроватей </summary>
public partial class RoomVariantBedTypeCommands
{
    ///<summary> Запрос обновления варианта кровати </summary>
    public class UpdateRequest : IRequest<RoomVariantBedTypeDTO>
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