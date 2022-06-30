using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRoomVariantHandler : IRequestHandler<RoomVariant.DeleteRequest, Unit>
{
    private readonly RoomVariantRepository _repository;

    public DeleteRoomVariantHandler(RoomVariantRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(RoomVariant.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди вариантов номеров </summary>
public partial class RoomVariant
{
    ///<summary> Запрос удаления варинта номера </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор варинта номера</summary>
        public Guid Id { get; set; }
    }
}