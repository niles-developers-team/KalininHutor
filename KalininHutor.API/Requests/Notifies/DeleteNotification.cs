using KalininHutor.DAL;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteNotificationHandler : IRequestHandler<NotificationCommands.Delete>
{
    private readonly FileObjectRepository _repository;

    public DeleteNotificationHandler(FileObjectRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Unit> Handle(NotificationCommands.Delete request, CancellationToken cancellationToken)
    {
        await _repository.Delete(request.Ids);
        return Unit.Value;
    }
}

public partial class NotificationCommands
{
    ///<summary> Команда на удаление уведомления </summary>
    public class Delete : IRequest
    {
        ///<summary> Идентификаторы уведомлений, которые необходимо удалить </summary>
        public IReadOnlyList<Guid> Ids { get; set; } = new List<Guid>();
    }
}