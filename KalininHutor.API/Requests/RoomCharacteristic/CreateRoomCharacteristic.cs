using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using KalininHutor.API.DTO;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Requests;

internal class CreateRoomCharacteristicHandler : IRequestHandler<RoomCharacteristicCommands.CreateRequest, RoomCharacteristicDTO>
{
    private readonly RoomCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomCharacteristicHandler(RoomCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<RoomCharacteristicDTO> Handle(RoomCharacteristicCommands.CreateRequest request, CancellationToken cancellationToken)
    {
        var entity = new RoomCharacteristic(request.Name, request.Description, request.Type);
        await _repository.Create(_mapper.Map<RoomCharacteristicEntity>(entity));

        return _mapper.Map<RoomCharacteristicDTO>(entity);
    }
}

///<summary> Запросы и очереди характеристик номеров </summary>
public partial class RoomCharacteristicCommands
{
    ///<summary> Запрос на создание характеристики номера </summary>
    public class CreateRequest : IRequest<RoomCharacteristicDTO>
    {
        ///<summary> Название объекта аренды </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Описание объекта аренды </summary>
        public string Description { get; set; } = string.Empty;
        ///<summary> Тип характеристики </summary>
        public CharacteristicTypes Type { get; set; }
    }
}