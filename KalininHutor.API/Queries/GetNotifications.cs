using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using MediatR;

namespace KalininHutor.API.Commands;

internal class GetNotificationsHandler : IRequestHandler<NotificationCommands.Get, IEnumerable<NotificationDTO>>
{
    private readonly NotificationRepository _repository;
    private readonly HttpContext _context;
    private readonly IMapper _mapper;

    public GetNotificationsHandler(NotificationRepository repository, IHttpContextAccessor contextAccessor, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _context = contextAccessor != null && contextAccessor.HttpContext != null ? contextAccessor.HttpContext : throw new ArgumentNullException(nameof(contextAccessor));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<NotificationDTO>> Handle(NotificationCommands.Get request, CancellationToken cancellationToken)
    {
        var claim = _context.User.FindFirst("id");
        if (claim == null || claim.Value == null)
            throw new UnauthorizedAccessException();

        request.UserId = Guid.Parse(claim.Value);

        var result = await _repository.Get(_mapper.Map<NotificationSearchOptions>(request));
        return result.Select(_mapper.Map<NotificationDTO>).ToList();
    }
}

///<summary> Запросы и очереди характеристик вариантов номеров </summary>
public partial class NotificationCommands
{
    ///<summary> Очередь получения характеристики варианта номера </summary>
    public class Get : IRequest<IEnumerable<NotificationDTO>>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
        ///<summary> Идентфикатор пользователя </summary>
        public Guid UserId { get; set; }
        ///<summary> Статус уведомления </summary>
        public NotificationStatus Status { get; set; }
    }
}