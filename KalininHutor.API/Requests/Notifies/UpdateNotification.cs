using AutoMapper;
using KalininHutor.DAL;
using KalininHutor.Domain;
using MediatR;

namespace KalininHutor.API.Requests;

internal class UpdateNotificationHandler : IRequestHandler<NotificationCommands.Update>
{
    private readonly NotificationRepository _repository;
    private readonly IMapper _mapper;

    public UpdateNotificationHandler(NotificationRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(NotificationCommands.Update request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<Notification>(await _repository.Get(request.Id));

        entity.SetRead(request.Read);

        await _repository.Update(_mapper.Map<NotificationEntity>(entity));

        return Unit.Value;
    }
}

public partial class NotificationCommands
{
    public class Update : IRequest
    {
        public Guid Id { get; set; }
        public bool Read { get; set; }
    }
}