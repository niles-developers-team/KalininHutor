using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class DeleteRoomVariantBedTypeHandler : IRequestHandler<DeleteRoomVariantBedTypeRequest, Unit>
{
    private readonly RoomVariantBedTypeRepository _repository;

    public DeleteRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteRoomVariantBedTypeRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запрос удаления варианта кровати в номере </summary>
public class DeleteRoomVariantBedTypeRequest : IRequest<Unit>
{
    ///<summary> Идентификатор варианта кровати </summary>
    public Guid Id { get; set; }
}