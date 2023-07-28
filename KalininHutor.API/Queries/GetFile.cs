using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using MediatR;

namespace KalininHutor.API.Commands;

internal class GetFileHandler : IRequestHandler<FileCommands.GetFile, FileObjectDTO>
{
    private readonly FileObjectRepository _repository;
    private readonly ISender _sender;

    private readonly IMapper _mapper;

    public GetFileHandler(
        ISender sender,
        FileObjectRepository repository,
        IMapper mapper
    )
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<FileObjectDTO> Handle(FileCommands.GetFile request, CancellationToken cancellationToken) =>
         _mapper.Map<FileObjectDTO>(await _repository.Get(request.Id));
}

///<summary> Запросы и очереди файлов </summary>
public partial class FileCommands
{
    ///<summary> Очередь получения файлов </summary>
    public class GetFile : IRequest<FileObjectDTO>
    {
        ///<summary> Идентификатор родительского объекта </summary>
        public Guid Id { get; set; }
    }
}