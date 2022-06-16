using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingRoomVariantHandler : IRequestHandler<BookingRoomVariantRequests.DeleteRequest, Unit>
{
    private readonly BookingRoomVariantRepository _repository;

    public DeleteBookingRoomVariantHandler(BookingRoomVariantRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(BookingRoomVariantRequests.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);
        return Unit.Value;
    }
}

///<summary> Запросы и очереди выбранных номеров </summary>
public partial class BookingRoomVariantRequests
{
    ///<summary> Запрос удаления выбранного варианта номера </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор выбранного варианта номера </summary>
        public Guid Id { get; set; }
    }
}