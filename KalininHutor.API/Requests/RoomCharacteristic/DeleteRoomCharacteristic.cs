using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class DeleteRoomCharacteristicHandler : IRequestHandler<DeleteRoomCharacteristicRequest, Unit>
{
    private readonly RoomCharacteristicRepository _repository;

    public DeleteRoomCharacteristicHandler(RoomCharacteristicRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteRoomCharacteristicRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запрос удаления характеристики номера </summary>
public class DeleteRoomCharacteristicRequest : IRequest<Unit>
{
    ///<summary> Идентификатор характеристики номера </summary>
    public Guid Id { get; set; }
}