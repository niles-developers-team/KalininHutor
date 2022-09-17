using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using KalininHutor.Domain;
using MediatR;

namespace KalininHutor.API.Requests;

internal class CreateNotifyHandler : IRequestHandler<NotificationCommands.Create>
{
    private readonly NotificationRepository _repository;
    private readonly INotificationInformer _informer;
    private readonly IMapper _mapper;

    public CreateNotifyHandler(
        NotificationRepository repository,
        INotificationInformer informer,
        IMapper mapper
    )
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _informer = informer ?? throw new ArgumentNullException(nameof(informer));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }


    public async Task<Unit> Handle(NotificationCommands.Create request, CancellationToken cancellationToken)
    {
        var notify = new Notification(request.UserID, request.Type, request.Message, request.Variant);

        await _repository.Create(_mapper.Map<NotificationEntity>(notify));

        await _informer.ReceiveNotification(_mapper.Map<NotificationDTO>(notify));

        return Unit.Value;
    }
}

public partial class NotificationCommands
{
    public class Create : IRequest
    {
        public NotifyVariant Variant { get; }
        public string Message { get; set; }
        public NotifyType Type { get; set; }
        public Guid UserID { get; set; }

        public Create(NotifyVariant variant, string message, NotifyType type, Guid userId)
        {
            Variant = variant;
            Message = message;
            Type = type;
            UserID = userId;
        }
    }
}