using AutoMapper;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetUserDetailsHandler : IRequestHandler<GetUserDetailsRequest, GetUserDetailsResponse>
{
    private readonly UserRepository _repository;
    private readonly IMapper _mapper;

    public GetUserDetailsHandler(UserRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<GetUserDetailsResponse> Handle(GetUserDetailsRequest request, CancellationToken cancellationToken)
    {
        return _mapper.Map<GetUserDetailsResponse>(await _repository.Get(request.Id));
    }
}

public class GetUserDetailsRequest : IRequest<GetUserDetailsResponse>
{
    public Guid Id { get; set; }
}

public class GetUserDetailsResponse
{
    public Guid Id { get; set; }
    public string PhoneNumber { get; set; }
    public string Name { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public DateOnly? Birthday { get; set; }
}