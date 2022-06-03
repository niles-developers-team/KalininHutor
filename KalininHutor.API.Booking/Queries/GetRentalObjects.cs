using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Queries;

internal class GetRentalObjectsHandler : IRequestHandler<GetRentalObjectsQuery, IEnumerable<GetRentalObjectResponse>>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public GetRentalObjectsHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<GetRentalObjectResponse>> Handle(GetRentalObjectsQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RentalObjectSearchOptions>(request));
        return result.Select(_mapper.Map<GetRentalObjectResponse>).ToList();
    }
}

///<summary> Очередь получения объектов аренды </summary>
public class GetRentalObjectsQuery : IRequest<IEnumerable<GetRentalObjectResponse>>
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid? Id { get; set; }
    ///<summary> Строка поиска </summary>
    public string? SearchText { get; set; }
    ///<summary> Время заезда </summary>
    public TimeOnly? CheckinTime { get; set; }
    ///<summary> Время отъезда </summary>
    public TimeOnly? CheckoutTime { get; set; }
}

///<summary> Модель чтения объекта аренды </summary>
public class GetRentalObjectResponse
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid Id { get; protected set; }
    ///<summary> Название объекта аренды  </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<summary> Описание объекта аренды </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<summary> Время заезда объекта аренды </summary>
    public TimeOnly CheckinTime { get; protected set; }
    ///<summary> Время отъезда объекта аренды </summary>
    public TimeOnly CheckoutTime { get; protected set; }
}