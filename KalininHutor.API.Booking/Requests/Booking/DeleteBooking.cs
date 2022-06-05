using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class DeleteBookingHandler : IRequestHandler<DeleteBookingRequest, Unit>
{
    private readonly BookingRepository _repository;

    public DeleteBookingHandler(BookingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteBookingRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запрос удаления объекта аренды </summary>
public class DeleteBookingRequest : IRequest<Unit>
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid Id { get; set; }
}