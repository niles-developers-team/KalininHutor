using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Helpers;
using KalininHutor.DAL;
using KalininHutor.DAL.Identity;
using KalininHutor.Domain.Identity;
using MediatR;

namespace KalininHutor.API.Commands;

internal class UpdateUserHandler : IRequestHandler<UserCommands.UpdateRequest, UserDetailsDTO>
{
    private readonly UserRepository _repository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly IMapper _mapper;

    public UpdateUserHandler(UserRepository repository, FileObjectRepository fileObjectRepository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<UserDetailsDTO> Handle(UserCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<User>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Lastname, request.Email, request.Birthday);

        var avatars = await _fileObjectRepository.Get(new FileObjectSearchOptions { ParentId = request.Id });

        if (avatars != null)
        {
            await _fileObjectRepository.Delete(avatars.Select(o => o.Id).ToList());
        }
        if (request.NewAvatar != null)
        {
            entity.CreatePhoto(request.NewAvatar.Name, request.NewAvatar.Extension, request.NewAvatar.Body, 0);
            await _fileObjectRepository.Create(_mapper.Map<FileObjectEntity>(entity.Avatar));
        }

        await _repository.Update(_mapper.Map<UserEntity>(entity));
        return _mapper.Map<UserDetailsDTO>(entity);
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Запрос на изменение пользователя </summary>
    public class UpdateRequest : IRequest<UserDetailsDTO>
    {
        ///<summary> Идентификатор пользователя </summary>
        public Guid Id { get; set; }
        ///<summary> Номер телефона </summary>
        public string PhoneNumber { get; set; } = string.Empty;
        ///<summary> Имя </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Фамилия </summary>
        public string Lastname { get; set; } = string.Empty;
        ///<summary> E-mail </summary>
        public string Email { get; set; } = string.Empty;
        ///<summary> Дата рождения </summary>
        public DateOnly? Birthday { get; set; }

        ///<summary> Новый аватар пользователя </summary>
        public FileObjectDTO? NewAvatar { get; set; }
    }
}