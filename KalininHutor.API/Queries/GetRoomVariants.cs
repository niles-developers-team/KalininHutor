using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRoomVariantHandler : IRequestHandler<RoomVariantQueries.GetQuery, IEnumerable<RoomVariantDTO>>
{
    private readonly RoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomVariantHandler(RoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomVariantDTO>> Handle(RoomVariantQueries.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomVariantSearchOptions>(request));
        return result.Select(_mapper.Map<RoomVariantDTO>).ToList();
    }
}

///<summary> Запросы и очереди вариантов номеров </summary>
public partial class RoomVariantQueries
{
    ///<summary> Очередь получения варинтов номеров </summary>
    public class GetQuery : IRequest<IEnumerable<RoomVariantDTO>>
    {
        ///<summary> Идентификатор варинта номера объекта аренды </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid? RentalObjectId { get; set; }
    }
}