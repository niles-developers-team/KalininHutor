using KalininHutor.DAL;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class DeleteRoomVariantHandler : IRequestHandler<RoomVariantCommands.DeleteRequest, Unit>
{
    private readonly ISender _sender;
    private readonly RoomVariantRepository _repository;
    private readonly RoomVariantCharacteristicRepository _roomVariantCharacteristicRepository;
    private readonly RoomVariantBedTypeRepository _roomVariantBedTypeRepository;
    private readonly FileObjectRepository _fileObjectRepository;

    public DeleteRoomVariantHandler(ISender sender, RoomVariantRepository repository,
        RoomVariantCharacteristicRepository roomVariantCharacteristicRepository,
        RoomVariantBedTypeRepository roomVariantBedTypeRepository, 
        FileObjectRepository fileObjectRepository
    )
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _roomVariantCharacteristicRepository = roomVariantCharacteristicRepository ?? throw new ArgumentNullException(nameof(roomVariantCharacteristicRepository));
        _roomVariantBedTypeRepository = roomVariantBedTypeRepository ?? throw new ArgumentNullException(nameof(roomVariantBedTypeRepository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
    }

    public async Task<Unit> Handle(RoomVariantCommands.DeleteRequest request, CancellationToken cancellationToken)
    {
        var characteristics = await _roomVariantCharacteristicRepository.Get(new RoomVariantCharacteristicSearchOptions { RoomsVariantsIds = request.Ids });
        var bedTypes = await _roomVariantBedTypeRepository.Get(new RoomVariantBedTypeSearchOptions { RoomsVariantsIds = request.Ids });

        await _sender.Send(new RoomVariantCharacteristicCommands.DeleteRequest { Ids = characteristics.Select(o => o.Id).ToList() });
        await _sender.Send(new RoomVariantBedTypeCommands.DeleteRequest { Ids = bedTypes.Select(o => o.Id).ToList() });

        var fileObjects = await _fileObjectRepository.Get(new FileObjectSearchOptions { ParentsIds = request.Ids.ToList() });

        await _fileObjectRepository.Delete(fileObjects.Select(o => o.Id).ToList());

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
        public IReadOnlyList<Guid> Ids { get; set; } = new List<Guid>();
    }
}