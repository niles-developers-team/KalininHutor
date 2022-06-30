using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRoomVariantCharacteristicHandler : IRequestHandler<RoomVariantCharacteristic.DeleteRequest, Unit>
{
    private readonly RoomVariantCharacteristicRepository _repository;

    public DeleteRoomVariantCharacteristicHandler(RoomVariantCharacteristicRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(RoomVariantCharacteristic.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}


///<summary> Запросы и очереди характеристик вариантов номеров </summary>
public partial class RoomVariantCharacteristic
{
///<summary> Запрос удаления характеристики варианта номера </summary>
public class DeleteRequest : IRequest<Unit>
{
    ///<summary> Идентификатор характеристики варианта номера </summary>
    public Guid Id { get; set; }
}
}