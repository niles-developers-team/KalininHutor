using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class UpdateRoomCharacteristicHandler : IRequestHandler<UpdateRoomCharacteristicRequest, Unit>
{
    private readonly RoomCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomCharacteristicHandler(RoomCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(UpdateRoomCharacteristicRequest request, CancellationToken cancellationToken)
    {
        var RoomCharacteristics = await _repository.Get(new RoomCharacteristicSearchOptions { Id = request.Id });
        var entity = _mapper.Map<RoomCharacteristic>(RoomCharacteristics.SingleOrDefault());
        entity.SetInfo(request.Name, request.Description, request.Type);
        await _repository.Update(_mapper.Map<RoomCharacteristicEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запрос обновления характеристики номера </summary>
public class UpdateRoomCharacteristicRequest : IRequest<Unit>
{
    ///<summary> Идентификатор характеристики номера </summary>
    public Guid Id { get; protected set; }
    ///<summary> Название характеристики номера </summary>
    public string Name { get; set; } = string.Empty;
    ///<summary> Описание характеристики номера </summary>
    public string Description { get; set; } = string.Empty;
    ///<summary> Тип характеристики </summary>
    public CharacteristicTypes Type { get; set; }
}