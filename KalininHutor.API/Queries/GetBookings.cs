using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

internal class GetBookingsHandler : IRequestHandler<Booking.GetQuery, IEnumerable<BookingDTO>>
{
    private readonly BookingRepository _repository;
    private readonly BookingRoomVariantRepository _bookingRoomVariantRepository;
    private readonly ISender _sender;

    private readonly IMapper _mapper;

    public GetBookingsHandler(
        ISender sender,
        BookingRepository repository,
        BookingRoomVariantRepository bookingRoomVariantRepository,
        IMapper mapper
    )
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _bookingRoomVariantRepository = bookingRoomVariantRepository ?? throw new ArgumentNullException(nameof(bookingRoomVariantRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<BookingDTO>> Handle(Booking.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingSearchOptions>(request));

        var bookings = result.Select(_mapper.Map<BookingDTO>).ToList();

        var rentalObjects = await _sender.Send(new RentalObject.GetQuery { Ids = bookings.Select(o => o.RentalObjectId), GetRoomVariants = true });

        var roomVariants = await _bookingRoomVariantRepository.Get(new BookingRoomVariantSearchOptions { BookingsIds = bookings.Select(o => o.Id).ToList() });

        bookings.ForEach(b =>
        {
            b.RentalObject = rentalObjects.First(o => o.Id == b.RentalObjectId);
            b.RoomVariants = roomVariants.Where(o => o.BookingId == b.Id).Select(_mapper.Map<BookingRoomVariantDTO>);
        });

        return bookings;
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class Booking
{
    ///<summary> Очередь получения брони </summary>
    public class GetQuery : IRequest<IEnumerable<BookingDTO>>
    {
        ///<summary> Идентификатор брони </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор арендатора </summary>
        public Guid? TenantId { get; set; }
        ///<summary> Поисковая строка </summary>
        public string? SearchText { get; set; }
        ///<summary> Дата заезда </summary>
        public DateTime? CheckinDate { get; set; }
        ///<summary> Дата отъезда </summary>
        public DateTime? CheckoutDate { get; set; }
    }
}