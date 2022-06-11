using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetBookingRoomVariantsHandler : IRequestHandler<BookingRoomVariant.GetQuery, IEnumerable<BookingRoomVariant.GetResponse>>
{
    private readonly BookingRoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingRoomVariantsHandler(BookingRoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<BookingRoomVariant.GetResponse>> Handle(BookingRoomVariant.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingRoomVariantSearchOptions>(request));
        return result.Select(_mapper.Map<BookingRoomVariant.GetResponse>).ToList();
    }
}

public partial class BookingRoomVariant
{
    ///<summary> Очередь получения забронированных вариантов кроватей в номера </summary>
    public class GetQuery : IRequest<IEnumerable<GetResponse>>
    {
        ///<summary> Идентификатор выбранного номера </summary>
        public Guid? Id { get; set; }

        ///<summary> Идентификатор брони </summary>
        public Guid? BookingId { get; set; }
    }

    ///<summary> Модель чтения выбранного варианта номера </summary>
    public class GetResponse
    {
        ///<summary> Идентификатор выбранного номера </summary>
        public Guid Id { get; protected set; }
        ///<summary> Идентификатор варианта номера </summary>
        public Guid RoomVariantId { get; protected set; }
        ///<summary> Идентификатор брони </summary>
        public Guid BookingId { get; protected set; }
        ///<summary> Всего за номер (руб.) </summary>
        public decimal Amount { get; protected set; }
    }
}