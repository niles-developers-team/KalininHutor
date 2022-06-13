using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteUserHandler : IRequestHandler<User.DeleteRequest, Unit>
{
    private readonly UserRepository _repository;

    public DeleteUserHandler(UserRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(User.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Id);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class User
{
    ///<summary> Запрос на удаление пользователя </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; set; }
    }
}