using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class GetRentalObjectsBestDemandsHandler : IRequestHandler<RentalObject.GetRentalObjectsBestDemandsQuery, IEnumerable<RentalObjectBestDemandDTO>>
{
    private readonly RoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public GetRentalObjectsBestDemandsHandler(RoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RentalObjectBestDemandDTO>> Handle(RentalObject.GetRentalObjectsBestDemandsQuery request, CancellationToken cancellationToken)
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
public partial class RentalObject
{
    ///<summary> Очередь получения объектов аренды </summary>
    public class GetRentalObjectsBestDemandsQuery : IRequest<IEnumerable<RentalObjectBestDemandDTO>>
    {
        public IReadOnlyList<Guid> RentalObjectsIds { get; set; }
        public int AdultsCount { get; set; }
        public int ChildsCount { get; set; }
        public int NightsCount { get; set; }
    }
}