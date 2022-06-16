using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRoomCharacteristicHandler : IRequestHandler<RoomCharacteristicRequests.DeleteRequest, Unit>
{
    private readonly RoomCharacteristicRepository _repository;

    public DeleteRoomCharacteristicHandler(RoomCharacteristicRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(RoomCharacteristicRequests.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди характеристик номеров </summary>
public partial class RoomCharacteristicRequests
{
    ///<summary> Запрос удаления характеристики номера </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid Id { get; set; }
    }
}