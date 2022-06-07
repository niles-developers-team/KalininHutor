using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingRoomVariantHandler : IRequestHandler<DeleteBookingRoomVariantRequest, Unit>
{
    private readonly BookingRoomVariantRepository _repository;

    public DeleteBookingRoomVariantHandler(BookingRoomVariantRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteBookingRoomVariantRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);
        return Unit.Value;
    }
}

///<summary> Запрос удаления выбранного варианта номера </summary>
public class DeleteBookingRoomVariantRequest : IRequest<Unit>
{
    ///<summary> Идентификатор выбранного варианта номера </summary>
    public Guid Id { get; set; }
}