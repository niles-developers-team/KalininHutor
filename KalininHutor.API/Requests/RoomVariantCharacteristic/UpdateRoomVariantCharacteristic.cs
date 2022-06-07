using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class UpdateRoomVariantCharacteristicHandler : IRequestHandler<UpdateRoomVariantCharacteristicRequest, Unit>
{
    private readonly RoomVariantCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantCharacteristicHandler(RoomVariantCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(UpdateRoomVariantCharacteristicRequest request, CancellationToken cancellationToken)
    {
        var RoomVariantCharacteristics = await _repository.Get(new RoomVariantCharacteristicSearchOptions { Id = request.Id });
        var entity = _mapper.Map<RoomVariantCharacteristic>(RoomVariantCharacteristics.SingleOrDefault());
        entity.SetPrice(request.Price);
        await _repository.Update(_mapper.Map<RoomVariantCharacteristicEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запрос обновления характеристики варианта номера </summary>
public class UpdateRoomVariantCharacteristicRequest : IRequest<Unit>
{
    ///<summary> Идентификатор характеристики номера </summary>
    public Guid Id { get; protected set; }
    ///<summary> Цена за услугу или удобство </summary>
    public decimal? Price { get; protected set; }
}