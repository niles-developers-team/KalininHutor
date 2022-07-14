using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class GetRentalObjectsHandler : IRequestHandler<RentalObject.GetQuery, IEnumerable<RentalObjectDTO>>
{
    private readonly RentalObjectRepository _repository;
    private readonly ISender _sender;
    private readonly IMapper _mapper;

    public GetRentalObjectsHandler(RentalObjectRepository repository, ISender sender, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RentalObjectDTO>> Handle(RentalObject.GetQuery request, CancellationToken cancellationToken)
    {
        var rentalObjects = await _repository.Get(_mapper.Map<RentalObjectSearchOptions>(request));
        var result = rentalObjects.Select(_mapper.Map<RentalObjectDTO>).ToList();

        if (request.GetBestDemands)
        {
            if (!request.CheckinDate.HasValue || !request.CheckoutDate.HasValue)
                throw new ApplicationException("При получении лучших предложений необходимо указывать даты заезда/отъезда");

            var nightsCount = (request.CheckoutDate.Value - request.CheckinDate.Value).Days;

            var bestDemands = await _sender.Send(new RentalObject.GetRentalObjectsBestDemandsQuery
            {
                AdultsCount = request.AdultsCount,
                ChildsCount = request.ChildsCount,
                NightsCount = nightsCount,
                RentalObjectsIds = result.Select(o => o.Id).ToList()
            });

            result.ForEach(ro => ro.BestDemand = bestDemands.FirstOrDefault(o => o.RentalObjectId == ro.Id));
        }

        return result;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObject
{
    ///<summary> Очередь получения объектов аренды </summary>
    public class GetQuery : IRequest<IEnumerable<RentalObjectDTO>>
    {
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

        public bool GetBestDemands { get; set; }

        public IReadOnlyList<Guid> SelectedCharacteristicsIds { get; set; } = new List<Guid>();
    }
}