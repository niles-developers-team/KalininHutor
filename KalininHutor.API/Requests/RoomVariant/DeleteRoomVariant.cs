using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRoomVariantHandler : IRequestHandler<RoomVariantCommands.DeleteRequest, Unit>
{
    private readonly ISender _sender;
    private readonly RoomVariantRepository _repository;
    private readonly RoomVariantCharacteristicRepository _roomVariantCharacteristicRepository;
    private readonly RoomVariantBedTypeRepository _roomVariantBedTypeRepository;

    public DeleteRoomVariantHandler(ISender sender, RoomVariantRepository repository,
        RoomVariantCharacteristicRepository roomVariantCharacteristicRepository,
        RoomVariantBedTypeRepository roomVariantBedTypeRepository
    )
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _roomVariantCharacteristicRepository = roomVariantCharacteristicRepository ?? throw new ArgumentNullException(nameof(roomVariantCharacteristicRepository));
        _roomVariantBedTypeRepository = roomVariantBedTypeRepository ?? throw new ArgumentNullException(nameof(roomVariantBedTypeRepository));
    }

    public async Task<Unit> Handle(RoomVariantCommands.DeleteRequest request, CancellationToken cancellationToken)
    {
        var characteristics = await _roomVariantCharacteristicRepository.Get(new RoomVariantCharacteristicSearchOptions { RoomsVariantsIds = request.Ids });
        var bedTypes = await _roomVariantBedTypeRepository.Get(new RoomVariantBedTypeSearchOptions { RoomsVariantsIds = request.Ids });

        await _sender.Send(new RoomVariantCharacteristicCommands.DeleteRequest { Ids = characteristics.Select(o => o.Id).ToList() });
        await _sender.Send(new RoomVariantBedTypeCommands.DeleteRequest { Ids = bedTypes.Select(o => o.Id).ToList() });

        await _repository.Delete(request.Ids);
        return Unit.Value;
    }
}

///<summary> Запросы и очереди вариантов номеров </summary>
public partial class RoomVariantCommands
{
    ///<summary> Запрос удаления варинта номера </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор варинта номера</summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}