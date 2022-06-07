using MediatR;
using AutoMapper;

using KalininHutor.Domain.Booking;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Requests;

internal class CreateRoomCharacteristicHandler : IRequestHandler<CreateRoomCharacteristicRequest, Guid>
{
    private readonly RoomCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomCharacteristicHandler(RoomCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateRoomCharacteristicRequest request, CancellationToken cancellationToken)
    {
        var RoomCharacteristic = new RoomCharacteristic(request.Name, request.Description, request.Type);
        await _repository.Create(_mapper.Map<RoomCharacteristicEntity>(RoomCharacteristic));

        return RoomCharacteristic.Id;
    }
}

///<summary> Запрос на создание характеристики номера </summary>
public class CreateRoomCharacteristicRequest : IRequest<Guid>
{
    ///<summary> Название объекта аренды </summary>
    public string Name { get; set; } = string.Empty;
    ///<summary> Описание объекта аренды </summary>
    public string Description { get; set; } = string.Empty;
    ///<summary> Тип характеристики </summary>
    public CharacteristicTypes Type { get; set; }
}