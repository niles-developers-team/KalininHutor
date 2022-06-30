using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Requests;

using DomainRoomCharacteristic = Domain.Booking.RoomCharacteristic;

internal class UpdateRoomCharacteristicHandler : IRequestHandler<RoomCharacteristic.UpdateRequest, Unit>
{
    private readonly RoomCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomCharacteristicHandler(RoomCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RoomCharacteristic.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<DomainRoomCharacteristic>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Description, request.Type);
        await _repository.Update(_mapper.Map<RoomCharacteristicEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запросы и очереди характеристик номеров </summary>
public partial class RoomCharacteristic
{
    ///<summary> Запрос обновления характеристики номера </summary>
    public class UpdateRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid Id { get; set; }
        ///<summary> Название характеристики номера </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Описание характеристики номера </summary>
        public string Description { get; set; } = string.Empty;
        ///<summary> Тип характеристики </summary>
        public CharacteristicTypes Type { get; set; }
    }
}
