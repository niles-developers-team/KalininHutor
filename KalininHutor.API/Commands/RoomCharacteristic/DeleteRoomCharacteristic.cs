using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class DeleteRoomCharacteristicHandler : IRequestHandler<RoomCharacteristicCommands.DeleteRequest, Unit>
{
    private readonly RoomCharacteristicRepository _repository;

    public DeleteRoomCharacteristicHandler(RoomCharacteristicRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(RoomCharacteristicCommands.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди характеристик номеров </summary>
public partial class RoomCharacteristicCommands
{
    ///<summary> Запрос удаления характеристики номера </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public IReadOnlyList<Guid> Ids { get; set; } = new List<Guid>();
    }
}