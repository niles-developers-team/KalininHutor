using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Requests;

using DomainRoomCharacteristic = Domain.Booking.RoomCharacteristic;

internal class CreateRoomCharacteristicHandler : IRequestHandler<RoomCharacteristic.CreateRequest, Guid>
{
    private readonly RoomCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomCharacteristicHandler(RoomCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(RoomCharacteristic.CreateRequest request, CancellationToken cancellationToken)
    {
        var RoomCharacteristic = new DomainRoomCharacteristic(request.Name, request.Description, request.Type);
        await _repository.Create(_mapper.Map<RoomCharacteristicEntity>(RoomCharacteristic));

        return RoomCharacteristic.Id;
    }
}

///<summary> Запросы и очереди характеристик номеров </summary>
public partial class RoomCharacteristic
{
    ///<summary> Запрос на создание характеристики номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Название объекта аренды </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Описание объекта аренды </summary>
        public string Description { get; set; } = string.Empty;
        ///<summary> Тип характеристики </summary>
        public CharacteristicTypes Type { get; set; }
    }
}