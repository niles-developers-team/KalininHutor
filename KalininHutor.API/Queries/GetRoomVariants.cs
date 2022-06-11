using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRoomVariantHandler : IRequestHandler<RoomVariant.GetQuery, IEnumerable<RoomVariant.GetResponse>>
{
    private readonly RoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomVariantHandler(RoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomVariant.GetResponse>> Handle(RoomVariant.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomVariantSearchOptions>(request));
        return result.Select(_mapper.Map<RoomVariant.GetResponse>).ToList();
    }
}

public partial class RoomVariant
{
    ///<summary> Очередь получения варинтов номеров </summary>
    public class GetQuery : IRequest<IEnumerable<GetResponse>>
    {
        ///<summary> Идентификатор варинта номера объекта аренды </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid? RentalObjectId { get; set; }
    }

    ///<summary> Модель чтения варинта номера </summary>
    public class GetResponse
    {
        ///<summary> Идентификатор варинта номера объекта аренды </summary>
        public Guid Id { get; protected set; }
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid RentalObjectId { get; protected set; }
        ///<summary> Название </summary>
        public string Name { get; protected set; } = string.Empty;
        ///<summary> Описание </summary>
        public string Description { get; protected set; } = string.Empty;
        ///<summary> Цена </summary>
        public decimal Price { get; protected set; }
        ///<summary> Ширина варианта номера </summary>
        public double Width { get; protected set; }
        ///<summary> Длина варианта номера </summary>
        public double Length { get; protected set; }
        ///<summary> Максимально человек в номере </summary>
        public int MaxPersonsCount { get; protected set; }
        ///<summary> Период бесплатной отмены </summary>
        public int? FreeCancellationPeriod { get; protected set; }
        ///<summary> Вариант оплаты </summary>
        public int PaymentOption { get; protected set; }
        ///<summary> Всего номеров </summary>
        public int Count { get; protected set; }
        ///<summary> Всего номеров свободно </summary>
        public int FreeCount { get; protected set; }
    }
}