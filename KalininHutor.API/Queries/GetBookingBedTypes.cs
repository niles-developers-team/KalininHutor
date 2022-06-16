using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetBookingBedTypesHandler : IRequestHandler<BookingBedTypeQueries.GetQuery, IEnumerable<BookingBedTypeDTO>>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingBedTypesHandler(BookingRoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<BookingBedTypeDTO>> Handle(BookingBedTypeQueries.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingRoomVariantBedTypeSearchOptions>(request));
        return result.Select(_mapper.Map<BookingBedTypeDTO>).ToList();
    }
}

///<summary> Запросы и очереди выбранных вариантов кроватей </summary>
public partial class BookingBedTypeQueries
{
    ///<summary> Очередь получения забронированных вариантов кроватей в номерах </summary>
    public class GetQuery : IRequest<IEnumerable<BookingBedTypeDTO>>
    {
        ///<summary> Идентификатор выбранной кровати в номер  </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор выбранного номера </summary>
        public Guid? BookingRoomVariantId { get; set; }
    }
}