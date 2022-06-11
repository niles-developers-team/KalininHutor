using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetBookingBedTypesHandler : IRequestHandler<BookingBedType.GetQuery, IEnumerable<BookingBedType.GetResponse>>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingBedTypesHandler(BookingRoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<BookingBedType.GetResponse>> Handle(BookingBedType.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingRoomVariantBedTypeSearchOptions>(request));
        return result.Select(_mapper.Map<BookingBedType.GetResponse>).ToList();
    }
}

///<summary> Запросы и очереди выбранных вариантов кроватей </summary>
public partial class BookingBedType
{
    ///<summary> Очередь получения забронированных вариантов кроватей в номерах </summary>
    public class GetQuery : IRequest<IEnumerable<GetResponse>>
    {
        ///<summary> Идентификатор выбранной кровати в номер  </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор выбранного номера </summary>
        public Guid? BookingRoomVariantId { get; set; }
    }

    ///<summary> Модель чтения забронированных вариантов кроватей в номерах </summary>
    public class GetResponse
    {
        ///<summary> Идентификатор выбранной кровати в номер </summary>
        public Guid Id { get; protected set; }
        ///<summary> Идентификатор выбранного номера </summary>
        public Guid BookingRoomVariantId { get; protected set; }
        ///<summary> Выбранный тип кровати </summary>
        public Guid BedTypeId { get; protected set; }
        ///<summary> Количество кроватей выбранного типа </summary>
        public int Count { get; protected set; }
    }
}