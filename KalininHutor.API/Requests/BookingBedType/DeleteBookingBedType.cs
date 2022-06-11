using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteBookingRoomVariantBedTypeHandler : IRequestHandler<BookingBedType.DeleteRequest, Unit>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;

    public DeleteBookingRoomVariantBedTypeHandler(BookingRoomVariantBedTypeRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(BookingBedType.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);
        return Unit.Value;
    }
}

public partial class BookingBedType
{
    ///<summary> Запрос удаления выбранного варианта кровати </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор выбранного варианта кровати </summary>
        public Guid Id { get; set; }
    }
}