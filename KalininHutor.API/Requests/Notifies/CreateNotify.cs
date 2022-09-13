using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Hubs;
using KalininHutor.DAL;
using KalininHutor.Domain;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace KalininHutor.API.Requests;

internal class CreateNotifyHandler : IRequestHandler<NotificationsCommands.CreateSuccess>
{
    private readonly NotifyRepository _repository;
    private readonly INotificationInformer _informer;
    private readonly IMapper _mapper;

    public CreateNotifyHandler(
        NotifyRepository repository,
        INotificationInformer informer,
        IMapper mapper
    )
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _informer = informer ?? throw new ArgumentNullException(nameof(informer));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }


    public async Task<Unit> Handle(NotificationsCommands.CreateSuccess request, CancellationToken cancellationToken)
    {
        var notify = new Notify(request.UserID, request.Type, request.Message, request.Variant);

        await _repository.Create(_mapper.Map<NotifyEntity>(notify));

        await _informer.ReceiveNotification(_mapper.Map<NotificationDTO>(notify));

        return Unit.Value;
    }
}

public class NotificationsCommands
{
    public abstract class Create : IRequest
    {
        public virtual NotifyVariant Variant { get; }
        public string Message { get; set; }
        public NotifyType Type { get; set; }
        public Guid UserID { get; set; }

        public Create(string message, NotifyType type, Guid userId)
        {
            Message = message;
            Type = type;
            UserID = userId;
        }
    }

    public class CreateSuccess : Create
    {
        public override NotifyVariant Variant => NotifyVariant.Success;

        public CreateSuccess(string message, NotifyType type, Guid userId) : base(message, type, userId) { }
    }
}