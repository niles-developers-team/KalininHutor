using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using MediatR;

namespace KalininHutor.API.Commands;

internal class GetPhotosHandler : IRequestHandler<FileCommands.GetQuery, IEnumerable<FileObjectDTO>>
{
    private readonly FileObjectRepository _repository;
    private readonly ISender _sender;

    private readonly IMapper _mapper;

    public GetPhotosHandler(
        ISender sender,
        FileObjectRepository repository,
        IMapper mapper
    )
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<FileObjectDTO>> Handle(FileCommands.GetQuery request, CancellationToken cancellationToken)
    {
        var photos = await _repository.Get(new FileObjectSearchOptions { ParentId = request.ParentId });
        return photos.Select(_mapper.Map<FileObjectDTO>).ToList();
    }
}

///<summary> Запросы и очереди файлов </summary>
public partial class FileCommands
{
    ///<summary> Очередь получения файлов </summary>
    public class GetQuery : IRequest<IEnumerable<FileObjectDTO>>
    {
        ///<summary> Идентификатор родительского объекта </summary>
        public Guid ParentId { get; set; }        
    }
}