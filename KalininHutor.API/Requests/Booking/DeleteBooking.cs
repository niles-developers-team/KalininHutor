using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingHandler : IRequestHandler<BookingCommands.DeleteRequest, Unit>
{
    private readonly BookingRepository _repository;

    public DeleteBookingHandler(BookingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(BookingCommands.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class BookingCommands
{
    ///<summary> Запрос удаления брони </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор брони </summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}