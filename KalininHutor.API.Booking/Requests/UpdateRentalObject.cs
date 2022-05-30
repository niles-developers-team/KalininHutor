using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

public class UpdateRentalObjectHandler : IRequestHandler<UpdateRentalObjectRequest, Unit>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRentalObjectHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(UpdateRentalObjectRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<Domain.Booking.RentalObject>(await _repository.Get(new RentalObjectSearchOptions { Id = request.Id }));
        entity.SetInfo(request.Name, request.Description);
        entity.SetCheckTime(request.CheckinTime, request.CheckoutTime);
        await _repository.Update(_mapper.Map<RentalObjectEntity>(entity));
        return Unit.Value;
    }
}

public class UpdateRentalObjectRequest : IRequest<Unit>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public TimeOnly CheckinTime { get; set; }
    public TimeOnly CheckoutTime { get; set; }
}