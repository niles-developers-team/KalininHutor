using KalininHutor.DAL;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class DeleteRentalObjectHandler : IRequestHandler<RentalObjectCommands.DeleteRequest, Unit>
{
    private readonly ISender _sender;
    private readonly RentalObjectRepository _repository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly RoomVariantRepository _roomVariantRepository;

    public DeleteRentalObjectHandler(ISender sender, RentalObjectRepository repository, FileObjectRepository fileObjectRepository, RoomVariantRepository roomVariantRepository)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _roomVariantRepository = roomVariantRepository ?? throw new ArgumentNullException(nameof(roomVariantRepository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
    }

    public async Task<Unit> Handle(RentalObjectCommands.DeleteRequest request, CancellationToken cancellationToken)
    {
        var roomVariants = await _roomVariantRepository.Get(new RoomVariantSearchOptions { RentalObjectsIds = request.Ids });
        await _sender.Send(new RoomVariantCommands.DeleteRequest { Ids = roomVariants.Select(o => o.Id).ToList() });

        var fileObjects = (await _fileObjectRepository.Get(new FileObjectSearchOptions { ParentsIds = request.Ids.ToList() })).ToList();

        await _fileObjectRepository.Delete(fileObjects.Select(o => o.Id).ToList());

        await _repository.Delete(request.Ids);
        return Unit.Value;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
{
    ///<summary> Запрос удаления объекта аренды </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        public IReadOnlyList<Guid> Ids { get; set; } = new List<Guid>();
    }
}