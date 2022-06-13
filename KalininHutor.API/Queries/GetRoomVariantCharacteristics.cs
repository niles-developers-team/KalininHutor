using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRoomVariantCharacteristicsHandler : IRequestHandler<RoomVariantCharacteristic.GetQuery, IEnumerable<RoomVariantCharacteristic.GetResponse>>
{
    private readonly RoomVariantCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomVariantCharacteristicsHandler(RoomVariantCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomVariantCharacteristic.GetResponse>> Handle(RoomVariantCharacteristic.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomVariantCharacteristicSearchOptions>(request));
        return result.Select(_mapper.Map<RoomVariantCharacteristic.GetResponse>).ToList();
    }
}

///<summary> Запросы и очереди характеристик вариантов номеров </summary>
public partial class RoomVariantCharacteristic
{
    ///<summary> Очередь получения характеристики варианта номера </summary>
    public class GetQuery : IRequest<IEnumerable<GetResponse>>
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
    }

    ///<summary> Модель чтения характеристики варианта номера </summary>
    public class GetResponse
    {
        ///<summary> Идентификатор характеристики номера </summary>
        public Guid Id { get; protected set; }
        ///<summary> Идентификатор номера </summary>
        public Guid RoomVariantId { get; protected set; }
        ///<summary> Идентификатор характеристики </summary>
        public Guid RoomCharacteristicId { get; protected set; }
        ///<summary> Цена за услугу или удобство </summary>
        public decimal Price { get; protected set; }
    }
}