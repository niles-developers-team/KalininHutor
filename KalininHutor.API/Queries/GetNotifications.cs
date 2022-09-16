using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using MediatR;

namespace KalininHutor.API.Requests;

internal class GetNotificationsHandler : IRequestHandler<NotificationCommands.Get, IEnumerable<NotificationDTO>>
{
    private readonly NotificationRepository _repository;
    private readonly IMapper _mapper;

    public GetNotificationsHandler(NotificationRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<NotificationDTO>> Handle(NotificationCommands.Get request, CancellationToken cancellationToken)
    {
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
    }
}