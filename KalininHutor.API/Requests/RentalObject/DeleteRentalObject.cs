using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRentalObjectHandler : IRequestHandler<RentalObject.DeleteRequest, Unit>
{
    private readonly ISender _sender;
    private readonly RentalObjectRepository _repository;
    private readonly RoomVariantRepository _roomVariantRepository;

    public DeleteRentalObjectHandler(ISender sender, RentalObjectRepository repository, RoomVariantRepository roomVariantRepository)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _roomVariantRepository = roomVariantRepository ?? throw new ArgumentNullException(nameof(roomVariantRepository));
    }

    public async Task<Unit> Handle(RentalObject.DeleteRequest request, CancellationToken cancellationToken)
    {
        var roomVariants = await _roomVariantRepository.Get(new RoomVariantSearchOptions { RentalObjectsIds = request.Ids });
        await _sender.Send(new RoomVariant.DeleteRequest { Ids = roomVariants.Select(o => o.Id).ToList() });

        await _repository.Delete(request.Ids);
        return Unit.Value;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObject
{
    ///<summary> Запрос удаления объекта аренды </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}