using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRoomVariantBedTypeHandler : IRequestHandler<RoomVariantBedType.DeleteRequest, Unit>
{
    private readonly RoomVariantBedTypeRepository _repository;

    public DeleteRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(RoomVariantBedType.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди вариантов кроватей </summary>
public partial class RoomVariantBedType
{
    ///<summary> Запрос удаления варианта кровати в номере </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор варианта кровати </summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}