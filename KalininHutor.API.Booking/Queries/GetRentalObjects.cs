using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

public class GetRentalObjectsHandler : IRequestHandler<GetRentalObjectsQuery, IEnumerable<GetRentalObjectResponse>>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public GetRentalObjectsHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<GetRentalObjectResponse>> Handle(GetRentalObjectsQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RentalObjectSearchOptions>(request));
        return result.Select(_mapper.Map<GetRentalObjectResponse>).ToList();
    }
}

public class GetRentalObjectsQuery : IRequest<IEnumerable<GetRentalObjectResponse>>
{    
    public Guid? Id { get; set; }
    public string? SearchText { get; set; }
    public TimeOnly? CheckinTime { get; set; }
    public TimeOnly? CheckoutTime { get; set; }
}

public class GetRentalObjectResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public TimeOnly CheckinTime { get; set; }
    public TimeOnly CheckoutTime { get; set; }
}