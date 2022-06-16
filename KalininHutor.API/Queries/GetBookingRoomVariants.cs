using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetBookingRoomVariantsHandler : IRequestHandler<BookingRoomVariantQueries.GetQuery, IEnumerable<BookingRoomVariantDTO>>
{
    private readonly BookingRoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingRoomVariantsHandler(BookingRoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<BookingRoomVariantDTO>> Handle(BookingRoomVariantQueries.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingRoomVariantSearchOptions>(request));
        return result.Select(_mapper.Map<BookingRoomVariantDTO>).ToList();
    }
}

///<summary> Запросы и очереди выбранных номеров </summary>
public partial class BookingRoomVariantQueries
{
    ///<summary> Очередь получения забронированных вариантов кроватей в номера </summary>
    public class GetQuery : IRequest<IEnumerable<BookingRoomVariantDTO>>
    {
        ///<summary> Идентификатор выбранного номера </summary>
        public Guid? Id { get; set; }

        ///<summary> Идентификатор брони </summary>
        public Guid? BookingId { get; set; }
    }

}