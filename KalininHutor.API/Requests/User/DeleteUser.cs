using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteUserHandler : IRequestHandler<UserRequests.DeleteRequest, Unit>
{
    private readonly UserRepository _repository;

    public DeleteUserHandler(UserRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(UserRequests.DeleteRequest request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserRequests
{
    ///<summary> Запрос на удаление пользователя </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор пользователя </summary>
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}