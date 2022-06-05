using MediatR;
using AutoMapper;

using KalininHutor.Domain.Booking;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Booking.Requests;

internal class CreateRoomVariantCharacteristicHandler : IRequestHandler<CreateRoomVariantCharacteristicRequest, Guid>
{
    private readonly RoomVariantCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomVariantCharacteristicHandler(RoomVariantCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateRoomVariantCharacteristicRequest request, CancellationToken cancellationToken)
    {
        var RoomVariantCharacteristic = new RoomVariantCharacteristic(request.RoomVariantId, request.RoomCharacteristicId, request.Price);
        await _repository.Create(_mapper.Map<RoomVariantCharacteristicEntity>(RoomVariantCharacteristic));

        return RoomVariantCharacteristic.Id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateRoomVariantCharacteristicRequest : IRequest<Guid>
{
    public Guid RoomVariantId { get; protected set; }
    public Guid RoomCharacteristicId { get; protected set; }
    public decimal? Price { get; protected set; }
}