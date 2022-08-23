using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingRoomVariantHandler : IRequestHandler<BookingRoomVariantCommands.DeleteRequest, Unit>
{
    private readonly BookingRoomVariantRepository _repository;

    public DeleteBookingRoomVariantHandler(BookingRoomVariantRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(BookingRoomVariantCommands.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);
        return Unit.Value;
    }
}

///<summary> Запросы и очереди выбранных номеров </summary>
public partial class BookingRoomVariantCommands
{
    ///<summary> Запрос удаления выбранного варианта номера </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор выбранного варианта номера </summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}