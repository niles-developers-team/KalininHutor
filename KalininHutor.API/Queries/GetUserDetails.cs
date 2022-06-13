using AutoMapper;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetUserDetailsHandler : IRequestHandler<User.GetDetailsQuery, User.GetDetailsResponse>
{
    private readonly UserRepository _repository;
    private readonly IMapper _mapper;

    public GetUserDetailsHandler(UserRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<User.GetDetailsResponse> Handle(User.GetDetailsQuery request, CancellationToken cancellationToken)
    {
        return _mapper.Map<User.GetDetailsResponse>(await _repository.Get(request.Id));
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class User
{
    ///<summary> Очередь получения деталей пользователя </summary>
    public class GetDetailsQuery : IRequest<GetDetailsResponse>
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; set; }
    }

    ///<summary> Модель чтения деталей пользователя </summary>
    public class GetDetailsResponse
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; protected set; }
        ///<summary> Номер телефона </summary>
        public string PhoneNumber { get; protected set; } = string.Empty;
        ///<summary> Имя </summary>
        public string? Name { get; protected set; }
        ///<summary> Фамилия </summary>
        public string? Lastname { get; protected set; }
        ///<summary> E-mail </summary>
        public string? Email { get; protected set; }
        ///<summary> Дата рождения </summary>
        public DateOnly? Birthday { get; protected set; }
    }
}