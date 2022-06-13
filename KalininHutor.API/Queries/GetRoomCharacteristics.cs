using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRoomCharacteristicsHandler : IRequestHandler<RoomCharacteristic.GetQuery, IEnumerable<RoomCharacteristic.GetResponse>>
{
    private readonly RoomCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomCharacteristicsHandler(RoomCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomCharacteristic.GetResponse>> Handle(RoomCharacteristic.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomCharacteristicSearchOptions>(request));
        return result.Select(_mapper.Map<RoomCharacteristic.GetResponse>).ToList();
    }
}

///<summary> Запросы и очереди характеристик номеров </summary>
public partial class RoomCharacteristic
{
    ///<summary> Очередь получения удобств и услуг</summary>
    public class GetQuery : IRequest<IEnumerable<GetResponse>>
    {
        ///<summary> Идентификатор характеристики </summary>
        public Guid Id { get; set; }
        ///<summary> Поисковая строка </summary>
        public string SearchText { get; set; } = string.Empty;
    }

    ///<summary> Модель чтения брони </summary>
    public class GetResponse
    {
        ///<summary> Идентификатор характеристики </summary>
        public Guid Id { get; protected set; }
        ///<summary> Название характеристики </summary>
        public string Name { get; protected set; } = string.Empty;
        ///<summary> Описание харакетирстики </summary>
        public string Description { get; protected set; } = string.Empty;
        ///<summary> Тип (Зона) харакетистики </summary>
        public CharacteristicTypes Type { get; protected set; }
    }
}