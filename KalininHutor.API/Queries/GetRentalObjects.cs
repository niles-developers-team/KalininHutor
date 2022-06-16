using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRentalObjectsHandler : IRequestHandler<RentalObjectQueries.GetQuery, IEnumerable<RentalObjectDTO>>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public GetRentalObjectsHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RentalObjectDTO>> Handle(RentalObjectQueries.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RentalObjectSearchOptions>(request));
        return result.Select(_mapper.Map<RentalObjectDTO>).ToList();
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectQueries
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
        public TimeOnly? CheckinTime { get; set; }
        ///<summary> Время отъезда </summary>
        public TimeOnly? CheckoutTime { get; set; }
    }
}