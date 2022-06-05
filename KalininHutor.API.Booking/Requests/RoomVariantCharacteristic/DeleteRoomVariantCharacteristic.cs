using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class DeleteRoomVariantCharacteristicHandler : IRequestHandler<DeleteRoomVariantCharacteristicRequest, Unit>
{
    private readonly RoomVariantCharacteristicRepository _repository;

    public DeleteRoomVariantCharacteristicHandler(RoomVariantCharacteristicRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteRoomVariantCharacteristicRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запрос удаления объекта аренды </summary>
public class DeleteRoomVariantCharacteristicRequest : IRequest<Unit>
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid Id { get; set; }
}