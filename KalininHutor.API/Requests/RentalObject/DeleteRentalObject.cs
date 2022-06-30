using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteRentalObjectHandler : IRequestHandler<RentalObject.DeleteRequest, Unit>
{
    private readonly RentalObjectRepository _repository;

    public DeleteRentalObjectHandler(RentalObjectRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(RentalObject.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObject
{
    ///<summary> Запрос удаления объекта аренды </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid Id { get; set; }
    }
}