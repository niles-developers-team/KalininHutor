using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRoomCharacteristicHandler : IRequestHandler<RoomCharacteristic.DeleteRequest, Unit>
{
    private readonly RoomCharacteristicRepository _repository;

    public DeleteRoomCharacteristicHandler(RoomCharacteristicRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(RoomCharacteristic.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

public partial class RoomCharacteristic
{
    ///<summary> Запрос удаления характеристики номера </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid Id { get; set; }
    }
}