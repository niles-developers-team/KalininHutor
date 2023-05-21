using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class GetRentalObjectsBestDemandsHandler : IRequestHandler<RentalObjectCommands.GetRentalObjectsBestDemandsQuery, IEnumerable<RentalObjectBestDemandDTO>>
{
    private readonly RoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public GetRentalObjectsBestDemandsHandler(RoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RentalObjectBestDemandDTO>> Handle(RentalObjectCommands.GetRentalObjectsBestDemandsQuery request, CancellationToken cancellationToken)
    {
        var bestDemands = new List<RentalObjectBestDemandDTO>();

        var roomVariants = await _repository.Get(new RoomVariantSearchOptions { RentalObjectsIds = request.RentalObjectsIds });
        foreach (var rentalObjectId in request.RentalObjectsIds)
        {
            var rentalObjectRoomVariants = roomVariants.Where(o => o.RentalObjectId == rentalObjectId);
            if (!rentalObjectRoomVariants.Any())
                throw new ApplicationException("Не найдены варианты номеров для объекта аренды");

            var rentalObjectBestDemand = rentalObjectRoomVariants.OrderByDescending(o => o.Price).FirstOrDefault();
            if (rentalObjectBestDemand == null)
                throw new ApplicationException("Возникла ошибка при выгрузке лучших предложений");

            bestDemands.Add(new RentalObjectBestDemandDTO(rentalObjectId, request.AdultsCount, request.ChildsCount, request.NightsCount, rentalObjectBestDemand.Price * request.NightsCount));
        }

        return bestDemands;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
{
    ///<summary> Очередь получения объектов аренды </summary>
    public class GetRentalObjectsBestDemandsQuery : IRequest<IEnumerable<RentalObjectBestDemandDTO>>
    {
        ///<summary> Коллекция идентификаторов объектов аренды</summary>
        public IReadOnlyList<Guid> RentalObjectsIds { get; set; } = new List<Guid>();
        ///<summary> Количество взрослых </summary>
        public int AdultsCount { get; set; }
        ///<summary> Количество детей </summary>
        public int ChildsCount { get; set; }
        ///<summary> Количество ночей </summary>
        public int NightsCount { get; set; }
    }
}