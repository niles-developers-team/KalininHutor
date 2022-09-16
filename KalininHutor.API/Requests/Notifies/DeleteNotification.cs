using KalininHutor.DAL;
using MediatR;

namespace KalininHutor.API.Requests;

internal class DeleteNotificationHandler : IRequestHandler<NotificationCommands.Delete>
{
    private readonly NotificationRepository _repository;

    public DeleteNotificationHandler(NotificationRepository repository)
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
    public class Delete : IRequest
    {
        public IReadOnlyList<Guid> Ids { get; set; }
    }
}