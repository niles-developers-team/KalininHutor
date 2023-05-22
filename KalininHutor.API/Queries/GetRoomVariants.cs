using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class GetRoomVariantHandler : IRequestHandler<RoomVariantCommands.GetQuery, IEnumerable<RoomVariantDTO>>
{
    private readonly RoomVariantRepository _repository;
    private readonly RoomVariantBedTypeRepository _roomVariantBedTypeRepository;
    private readonly RoomVariantCharacteristicRepository _roomVariantCharacteristicRepository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly IMapper _mapper;

    public GetRoomVariantHandler(RoomVariantRepository repository, RoomVariantBedTypeRepository roomVariantBedTypeRepository,
    RoomVariantCharacteristicRepository roomVariantCharacteristicRepository, FileObjectRepository fileObjectRepository,
     IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _roomVariantBedTypeRepository = roomVariantBedTypeRepository ?? throw new ArgumentNullException(nameof(roomVariantBedTypeRepository));
        _roomVariantCharacteristicRepository = roomVariantCharacteristicRepository ?? throw new ArgumentNullException(nameof(roomVariantCharacteristicRepository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomVariantDTO>> Handle(RoomVariantCommands.GetQuery request, CancellationToken cancellationToken)
    {
        var entities = await _repository.Get(_mapper.Map<RoomVariantSearchOptions>(request));

        var roomVariantsIds = entities.Select(o => o.Id).ToList();

        var bedTypes = await _roomVariantBedTypeRepository.Get(new RoomVariantBedTypeSearchOptions { RoomsVariantsIds = roomVariantsIds });
        var characteristics = await _roomVariantCharacteristicRepository.Get(new RoomVariantCharacteristicSearchOptions { RoomsVariantsIds = roomVariantsIds });

        var dtos = entities.Select(_mapper.Map<RoomVariantDTO>).ToList();

        dtos.ForEach(async r =>
        {
            r.BedTypes = bedTypes.Where(o => o.RoomVariantId == r.Id).Select(_mapper.Map<RoomVariantBedTypeDTO>);
            r.Characteristics = characteristics.Where(o => o.RoomVariantId == r.Id).Select(_mapper.Map<RoomVariantCharacteristicDTO>);
            r.Photos = (await _fileObjectRepository.Get(new FileObjectSearchOptions { ParentId = r.Id })).Select(_mapper.Map<FileObjectDTO>);
        });
        return dtos;
    }
}

///<summary> Запросы и очереди вариантов номеров </summary>
public partial class RoomVariantCommands
{
    ///<summary> Очередь получения варинтов номеров </summary>
    public class GetQuery : IRequest<IEnumerable<RoomVariantDTO>>
    {
        ///<summary> Идентификатор варинта номера объекта аренды </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid? RentalObjectId { get; set; }

        ///<summary> Коллекция идентификаторов объектов аренды </summary>
        public IEnumerable<Guid>? RentalObjectsIds { get; set; }
    }
}