using AutoMapper;
using KalininHutor.DAL;
using KalininHutor.Domain;
using MediatR;

namespace KalininHutor.API.Commands;

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
    ///<summary> Команда на обновление уведомления </summary>
    public class Update : IRequest
    {
        ///<summary> Идентфикатор уведомления, которое необходимо обновить </summary>
        public Guid Id { get; set; }
        ///<summary> Прочитано уведомление или нет </summary>
        public bool Read { get; set; }
    }
}