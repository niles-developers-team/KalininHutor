using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class DeleteRentalObjectHandler : IRequestHandler<DeleteRentalObjectRequest, Unit>
{
    private readonly RentalObjectRepository _repository;

    public DeleteRentalObjectHandler(RentalObjectRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(DeleteRentalObjectRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запрос удаления объекта аренды </summary>
public class DeleteRentalObjectRequest : IRequest<Unit>
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid Id { get; set; }
}