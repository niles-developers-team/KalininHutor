using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class UpdateRoomVariantCharacteristicHandler : IRequestHandler<RoomVariantCharacteristicCommands.UpdateRequest, RoomCharacteristicDTO>
{
    private readonly RoomVariantCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantCharacteristicHandler(RoomVariantCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<RoomCharacteristicDTO> Handle(RoomVariantCharacteristicCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<RoomVariantCharacteristic>(await _repository.Get(request.Id));
        entity.SetPrice(request.Price);
        await _repository.Update(_mapper.Map<RoomVariantCharacteristicEntity>(entity));
        return _mapper.Map<RoomCharacteristicDTO>(entity);
    }
}


///<summary> Запросы и очереди характеристик вариантов номеров </summary>
public partial class RoomVariantCharacteristicCommands
{
    ///<summary> Запрос обновления характеристики варианта номера </summary>
    public class UpdateRequest : IRequest<RoomCharacteristicDTO>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid Id { get; set; }
        ///<summary> Цена за услугу или удобство </summary>
        public decimal? Price { get; set; }
    }
}