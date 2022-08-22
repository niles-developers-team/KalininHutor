using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetUserDetailsHandler : IRequestHandler<UserCommands.GetDetailsQuery, UserDetailsDTO>
{
    private readonly UserRepository _repository;
    private readonly IMapper _mapper;

    public GetUserDetailsHandler(UserRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<UserDetailsDTO> Handle(UserCommands.GetDetailsQuery request, CancellationToken cancellationToken)
    {
        return _mapper.Map<UserDetailsDTO>(await _repository.Get(request.Id));
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Очередь получения деталей пользователя </summary>
    public class GetDetailsQuery : IRequest<UserDetailsDTO>
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; set; }
    }
}