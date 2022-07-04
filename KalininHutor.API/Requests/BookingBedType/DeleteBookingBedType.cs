using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingRoomVariantBedTypeHandler : IRequestHandler<BookingBedTypeRequests.DeleteRequest, Unit>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;

    public DeleteBookingRoomVariantBedTypeHandler(BookingRoomVariantBedTypeRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(BookingBedTypeRequests.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);
        return Unit.Value;
    }
}

///<summary> Запросы и очереди выбранных вариантов кроватей </summary>
public partial class BookingBedTypeRequests
{
    ///<summary> Запрос удаления выбранного варианта кровати </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор выбранного варианта кровати </summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}