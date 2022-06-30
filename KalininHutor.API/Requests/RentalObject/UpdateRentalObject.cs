using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

using DomainRentalObject = Domain.Booking.RentalObject;

internal class UpdateRentalObjectHandler : IRequestHandler<RentalObject.UpdateRequest, Unit>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRentalObjectHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RentalObject.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<DomainRentalObject>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Description);
        entity.SetCheckTime(request.CheckinTime, request.CheckoutTime);
        await _repository.Update(_mapper.Map<RentalObjectEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObject
{
    ///<summary> Запрос обновления объекта аренды </summary>
    public class UpdateRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        ///<remarks> Не изменяется, нужен только для поиска </remarks>
        public Guid Id { get; set; }

        ///<summary> Название объекта аренды </summary>
        public string Name { get; set; } = string.Empty;

        ///<summary> Идентификатор объекта аренды </summary>
        public string Description { get; set; } = string.Empty;

        ///<summary> Идентификатор объекта аренды </summary>
        public TimeOnly CheckinTime { get; set; }

        ///<summary> Идентификатор объекта аренды </summary>
        public TimeOnly CheckoutTime { get; set; }
    }
}