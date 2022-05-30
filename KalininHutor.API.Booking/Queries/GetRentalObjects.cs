using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

public class GetRentalObjectsHandler : IRequestHandler<GetRentalObjectsQuery, IEnumerable<RentalObject>>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public GetRentalObjectsHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RentalObject>> Handle(GetRentalObjectsQuery request, CancellationToken cancellationToken)
    {
        return (await _repository.Get(_mapper.Map<RentalObjectSearchOptions>(request))).Select(_mapper.Map<Domain.Booking.RentalObject>);
    }
}

public class GetRentalObjectsQuery : IRequest<IEnumerable<RentalObject>>
{

}