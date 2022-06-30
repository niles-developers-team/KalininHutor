using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class GetRoomCharacteristicsHandler : IRequestHandler<RoomCharacteristic.GetQuery, IEnumerable<RoomCharacteristicDTO>>
{
    private readonly RoomCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomCharacteristicsHandler(RoomCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomCharacteristicDTO>> Handle(RoomCharacteristic.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomCharacteristicSearchOptions>(request));
        return result.Select(_mapper.Map<RoomCharacteristicDTO>).ToList();
    }
}

///<summary> Запросы и очереди характеристик номеров </summary>
public partial class RoomCharacteristic
{
    ///<summary> Очередь получения удобств и услуг</summary>
    public class GetQuery : IRequest<IEnumerable<RoomCharacteristicDTO>>
    {
        ///<summary> Идентификатор характеристики </summary>
        public Guid? Id { get; set; }
        ///<summary> Поисковая строка </summary>
        public string? SearchText { get; set; } = string.Empty;
        public int? Take { get; set; }
    }
}