using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRentalObjectsHandler : IRequestHandler<RentalObject.GetQuery, IEnumerable<RentalObject.GetResponse>>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public GetRentalObjectsHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RentalObject.GetResponse>> Handle(RentalObject.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RentalObjectSearchOptions>(request));
        return result.Select(_mapper.Map<RentalObject.GetResponse>).ToList();
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObject
{
    ///<summary> Очередь получения объектов аренды </summary>
    public class GetQuery : IRequest<IEnumerable<GetResponse>>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid? Id { get; set; }
        ///<summary> Индентификатор владельца объекта аренды </summary>
        public Guid? LandlordId { get; set; }
        ///<summary> Строка поиска </summary>
        public string? SearchText { get; set; }
        ///<summary> Время заезда </summary>
        public TimeOnly? CheckinTime { get; set; }
        ///<summary> Время отъезда </summary>
        public TimeOnly? CheckoutTime { get; set; }
    }

    ///<summary> Модель чтения объекта аренды </summary>
    public class GetResponse
    {
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid Id { get; protected set; }
        ///<summary> Идентификатор владельца </summary>
        public Guid LandlordId { get; set; }
        ///<summary> Название объекта аренды  </summary>
        public string Name { get; protected set; } = string.Empty;
        ///<summary> Описание объекта аренды </summary>
        public string Description { get; protected set; } = string.Empty;
        ///<summary> Время заезда объекта аренды </summary>
        public TimeOnly CheckinTime { get; protected set; }
        ///<summary> Время отъезда объекта аренды </summary>
        public TimeOnly CheckoutTime { get; protected set; }
    }
}