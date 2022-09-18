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

    ///<summary> Команда на создания уведомления </summary>
    public class Create : IRequest
    {

        ///<summary> Вариант отображения </summary>
        public NotifyVariant Variant { get; }

        ///<summary> Сообщение </summary>
        public string Message { get; set; }

        ///<summary> Тип </summary>
        public NotifyType Type { get; set; }

        ///<summary> Идентификатор пользователя </summary>
        public Guid UserID { get; set; }

        ///<summary> Конструктор команды </summary>
        public Create(NotifyVariant variant, string message, NotifyType type, Guid userId)
        {
            Variant = variant;
            Message = message;
            Type = type;
            UserID = userId;
        }
    }
}