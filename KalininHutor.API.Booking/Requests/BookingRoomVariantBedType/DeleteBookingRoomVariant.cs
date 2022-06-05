using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class DeleteBookingRoomVariantBedTypeHandler : IRequestHandler<DeleteBookingRoomVariantBedTypeRequest, Unit>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;

    public DeleteBookingRoomVariantBedTypeHandler(BookingRoomVariantBedTypeRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteBookingRoomVariantBedTypeRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);
        return Unit.Value;
    }
}

///<summary> Запрос удаления объекта аренды </summary>
public class DeleteBookingRoomVariantBedTypeRequest : IRequest<Unit>
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid Id { get; set; }
}