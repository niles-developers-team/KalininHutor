using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Commands;

internal class GetUserDetailsHandler : IRequestHandler<UserCommands.GetDetailsQuery, UserDetailsDTO>
{
    private readonly UserRepository _repository;
    private readonly NotificationRepository _notificationRepository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly IMapper _mapper;

    public GetUserDetailsHandler(UserRepository repository, NotificationRepository notificationRepository, FileObjectRepository fileObjectRepository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _notificationRepository = notificationRepository ?? throw new ArgumentNullException(nameof(notificationRepository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<UserDetailsDTO> Handle(UserCommands.GetDetailsQuery request, CancellationToken cancellationToken)
    {
        var userDTO = _mapper.Map<UserDetailsDTO>(await _repository.Get(request.Id));

        var userNotifications = await _notificationRepository.Get(new NotificationSearchOptions { UserId = request.Id });

        userDTO.Notifications = userNotifications.Select(_mapper.Map<NotificationDTO>);

        userDTO.Avatar = _mapper.Map<FileObjectDTO>((await _fileObjectRepository.Get(new FileObjectSearchOptions { ParentId = request.Id })).FirstOrDefault());

        return userDTO;
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Очередь получения деталей пользователя </summary>
    public class GetDetailsQuery : IRequest<UserDetailsDTO>
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; set; }
    }
}