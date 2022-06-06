using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class DeleteRoomVariantHandler : IRequestHandler<DeleteRoomVariantRequest, Unit>
{
    private readonly RoomVariantRepository _repository;

    public DeleteRoomVariantHandler(RoomVariantRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteRoomVariantRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запрос удаления варинта номера </summary>
public class DeleteRoomVariantRequest : IRequest<Unit>
{
    ///<summary> Идентификатор варинта номера</summary>
    public Guid Id { get; set; }
}