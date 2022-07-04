using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingHandler : IRequestHandler<BookingRequests.DeleteRequest, Unit>
{
    private readonly BookingRepository _repository;

    public DeleteBookingHandler(BookingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(BookingRequests.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class BookingRequests
{
    ///<summary> Запрос удаления брони </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор брони </summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}