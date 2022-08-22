using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class UpdateRentalObjectHandler : IRequestHandler<RentalObjectCommands.UpdateRequest, Unit>
{
    private readonly ISender _sender;
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRentalObjectHandler(ISender sender, RentalObjectRepository repository, IMapper mapper)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RentalObjectCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<RentalObject>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Description);
        entity.SetCheckTime(request.CheckinTime, request.CheckoutTime);
        await _repository.Update(_mapper.Map<RentalObjectEntity>(entity));

        if (request.CreateRoomVariantsRequests != null)
            foreach (var req in request.CreateRoomVariantsRequests)
            {
                req.RentalObject = entity;
                await _sender.Send(req);
            }

        if (request.UpdateRoomVariantsRequests != null)
        foreach (var req in request.UpdateRoomVariantsRequests)
            await _sender.Send(req);

        if (request.DeleteRoomVariantsRequest != null)
        await _sender.Send(request.DeleteRoomVariantsRequest);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
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

        public IReadOnlyList<RoomVariantCommands.CreateRequest>? CreateRoomVariantsRequests { get; set; } = new List<RoomVariantCommands.CreateRequest>();

        public IReadOnlyList<RoomVariantCommands.UpdateRequest>? UpdateRoomVariantsRequests { get; set; } = new List<RoomVariantCommands.UpdateRequest>();

        public RoomVariantCommands.DeleteRequest? DeleteRoomVariantsRequest { get; set; }
    }
}