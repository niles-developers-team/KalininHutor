using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingHandler : IRequestHandler<Booking.DeleteRequest, Unit>
{
    private readonly BookingRepository _repository;

    public DeleteBookingHandler(BookingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(Booking.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class Booking
{
    ///<summary> Запрос удаления брони </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор брони </summary>
        public Guid Id { get; set; }
    }
}