using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class GetRentalObjectsHandler : IRequestHandler<RentalObjectCommands.GetQuery, IEnumerable<RentalObjectDTO>>
{
    private readonly RentalObjectRepository _repository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly ISender _sender;
    private readonly IMapper _mapper;

    public GetRentalObjectsHandler(RentalObjectRepository repository, FileObjectRepository fileObjectRepository, ISender sender, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RentalObjectDTO>> Handle(RentalObjectCommands.GetQuery request, CancellationToken cancellationToken)
    {
        var rentalObjects = await _repository.Get(_mapper.Map<RentalObjectSearchOptions>(request));
        var result = rentalObjects.Select(_mapper.Map<RentalObjectDTO>).ToList();

        if (request.GetBestDemands)
        {
            if (!request.CheckinDate.HasValue || !request.CheckoutDate.HasValue)
                throw new ApplicationException("При получении лучших предложений необходимо указывать даты заезда/отъезда");

            var nightsCount = (request.CheckoutDate.Value - request.CheckinDate.Value).Days;

            var bestDemands = await _sender.Send(new RentalObjectCommands.GetRentalObjectsBestDemandsQuery
            {
                AdultsCount = request.AdultsCount,
                ChildsCount = request.ChildsCount,
                NightsCount = nightsCount,
                RentalObjectsIds = result.Select(o => o.Id).ToList()
            });

            result.ForEach(ro => ro.BestDemand = bestDemands.FirstOrDefault(o => o.RentalObjectId == ro.Id));
        }

        if (request.GetRoomVariants)
        {
            var roomVariants = await _sender.Send(new RoomVariantCommands.GetQuery { RentalObjectsIds = result.Select(o => o.Id) });
            result.ForEach(ro => ro.RoomVariants = roomVariants.Where(o => o.RentalObjectId == ro.Id));
        }

        var photos = await _fileObjectRepository.Get(new FileObjectSearchOptions { ParentsIds = result.Select(o => o.Id).ToList() });

        if (photos != null)
            result.ForEach(ro => ro.Photos = photos.Where(o => o.ParentId == ro.Id).Select(_mapper.Map<FileObjectDTO>));

        return result;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
{
    ///<summary> Очередь получения объектов аренды </summary>
    public class GetQuery : IRequest<IEnumerable<RentalObjectDTO>>
    {
        ///<summary> Коллекция идентификаторов объектов аренды </summary>
        public IEnumerable<Guid>? Ids { get; set; }
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid? Id { get; set; }
        ///<summary> Индентификатор владельца объекта аренды </summary>
        public Guid? LandlordId { get; set; }
        ///<summary> Строка поиска </summary>
        public string? SearchText { get; set; }
        ///<summary> Время заезда </summary>
        public DateTime? CheckinDate { get; set; }
        ///<summary> Время отъезда </summary>
        public DateTime? CheckoutDate { get; set; }
        ///<summary> Количество взрослых </summary>
        public int AdultsCount { get; set; }
        ///<summary> Количество детей </summary>
        public int ChildsCount { get; set; }
        ///<summary> Количество комнат </summary>
        public int RoomsCount { get; set; }

        ///<summary> Нужно ли получать лучшие предложения </summary>
        public bool GetBestDemands { get; set; }

        ///<summary> Нужно ли получать варианты номеров </summary>
        public bool GetRoomVariants { get; set; }

        ///<summary> Фильтр по выбранным характеристикам</summary>
        public IReadOnlyList<Guid> SelectedCharacteristicsIds { get; set; } = new List<Guid>();
    }
}