using KalininHutor.DAL;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Commands;

internal class DeleteUserHandler : IRequestHandler<UserCommands.DeleteRequest, Unit>
{
    private readonly UserRepository _repository;
    private readonly FileObjectRepository _fileObjectRepository;

    public DeleteUserHandler(UserRepository repository,
        FileObjectRepository fileObjectRepository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
    }

    public async Task<Unit> Handle(UserCommands.DeleteRequest request, CancellationToken cancellationToken)
    {

        var fileObjects = await _fileObjectRepository.Get(new FileObjectSearchOptions { ParentsIds = request.Ids.ToList() });

        await _fileObjectRepository.Delete(fileObjects.Select(o => o.Id).ToList());

        await _repository.Delete(request.Ids);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Запрос на удаление пользователя </summary>
    public class DeleteRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор пользователя </summary>
        public IReadOnlyList<Guid> Ids { get; set; } = new List<Guid>();
    }
}