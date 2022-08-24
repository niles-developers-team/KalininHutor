using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Identity;
using KalininHutor.Domain.Identity;
using MediatR;

namespace KalininHutor.API.Requests;

internal class UpdateUserHandler : IRequestHandler<UserCommands.UpdateRequest, UserDetailsDTO>
{
    private readonly UserRepository _repository;
    private readonly IMapper _mapper;

    public UpdateUserHandler(UserRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<UserDetailsDTO> Handle(UserCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<User>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Lastname, request.Email, request.Birthday);
        await _repository.Update(_mapper.Map<UserEntity>(entity));
        return _mapper.Map<UserDetailsDTO>(entity);
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Запрос на изменение пользователя </summary>
    public class UpdateRequest : IRequest<UserDetailsDTO>
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; set; }
        ///<summary> Номер телефона </summary>
        public string PhoneNumber { get; set; } = string.Empty;
        ///<summary> Имя </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Фамилия </summary>
        public string Lastname { get; set; } = string.Empty;
        ///<summary> E-mail </summary>
        public string Email { get; set; } = string.Empty;
        ///<summary> Дата рождения </summary>
        public DateOnly? Birthday { get; set; }
    }
}