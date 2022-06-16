using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRoomVariantCharacteristicsHandler : IRequestHandler<RoomVariantCharacteristicQueries.GetQuery, IEnumerable<RoomVariantCharacteristicDTO>>
{
    private readonly RoomVariantCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomVariantCharacteristicsHandler(RoomVariantCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomVariantCharacteristicDTO>> Handle(RoomVariantCharacteristicQueries.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomVariantCharacteristicSearchOptions>(request));
        return result.Select(_mapper.Map<RoomVariantCharacteristicDTO>).ToList();
    }
}

///<summary> Запросы и очереди характеристик вариантов номеров </summary>
public partial class RoomVariantCharacteristicQueries
{
    ///<summary> Очередь получения характеристики варианта номера </summary>
    public class GetQuery : IRequest<IEnumerable<RoomVariantCharacteristicDTO>>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
    }
}