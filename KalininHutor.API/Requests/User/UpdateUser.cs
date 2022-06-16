using AutoMapper;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Requests;

using DomainUser = Domain.Identity.User;

internal class UpdateUserHandler : IRequestHandler<UserRequests.UpdateRequest, Unit>
{
    private readonly UserRepository _repository;
    private readonly IMapper _mapper;

    public UpdateUserHandler(UserRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(UserRequests.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<DomainUser>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Lastname, request.Email, request.Birthday);
        await _repository.Update(_mapper.Map<UserEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserRequests
{
    ///<summary> Запрос на изменение пользователя </summary>
    public class UpdateRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; set; }
        ///<summary> Номер телефона </summary>
        public string PhoneNumber { get; set; } = string.Empty;
        ///<summary> Имя </summary>
        public string? Name { get; set; }
        ///<summary> Фамилия </summary>
        public string? Lastname { get; set; }
        ///<summary> E-mail </summary>
        public string? Email { get; set; }
        ///<summary> Дата рождения </summary>
        public DateOnly Birthday { get; set; }
    }
}