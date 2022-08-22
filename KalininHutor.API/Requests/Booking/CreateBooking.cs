using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using System.ComponentModel.DataAnnotations;
using KalininHutor.API.DTO;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Identity;

namespace KalininHutor.API.Requests;

internal class CreateBookingHandler : IRequestHandler<BookingCommands.CreateRequest, BookingDTO>
{
    private readonly BookingRepository _repository;
    private readonly BookingRoomVariantRepository _bookingRoomVariantsRepository;
    private readonly RentalObjectRepository _rentalObjectRepository;
    private readonly RoomVariantRepository _roomVariantRepository;
    private readonly IMapper _mapper;

    public CreateBookingHandler(
        BookingRepository repository,
        RentalObjectRepository rentalObjectRepository,
        RoomVariantRepository roomVariantRepository,
        BookingRoomVariantRepository bookingRoomVariantsRepository,
        IMapper mapper
    )
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _rentalObjectRepository = rentalObjectRepository ?? throw new ArgumentNullException(nameof(rentalObjectRepository));
        _roomVariantRepository = roomVariantRepository ?? throw new ArgumentNullException(nameof(roomVariantRepository));
        _bookingRoomVariantsRepository = bookingRoomVariantsRepository ?? throw new ArgumentNullException(nameof(bookingRoomVariantsRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<BookingDTO> Handle(BookingCommands.CreateRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = _mapper.Map<RentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId));
        var roomVariants = await _roomVariantRepository.Get(new RoomVariantSearchOptions { RentalObjectId = request.RentalObjectId });
        var bookings = await _repository.Get(new BookingSearchOptions { RentalObjectId = request.RentalObjectId, });

        var bookingRoomVariants = await _bookingRoomVariantsRepository.Get(new BookingRoomVariantSearchOptions { BookingsIds = bookings.Select(o => o.Id).ToList() });
        var domainBookings = bookings.Select(_mapper.Map<Booking>).ToList();
        domainBookings.ForEach(b => b.SetRoomVariants(bookingRoomVariants.Where(o => o.BookingId == b.Id).Select(_mapper.Map<BookingRoomVariant>)));

        rentalObject.SetRoomVariants(roomVariants.Select(_mapper.Map<RoomVariant>).ToList());
        rentalObject.SetBookings(domainBookings);

        var booking = rentalObject.CreateBooking(_mapper.Map<User>(request.Tenant),
            request.CheckinDate, request.CheckoutDate,
            request.AdultCount, request.ChildCount,
            request.BookingRooms.Select(_mapper.Map<BookingRoomVariant>).ToList());

        await _repository.Create(_mapper.Map<BookingEntity>(booking));

        foreach (var roomVariant in booking.RoomVariants.Select(_mapper.Map<BookingRoomVariantEntity>))
        {
            await _bookingRoomVariantsRepository.Create(roomVariant);
        }
        var dto = _mapper.Map<BookingDTO>(booking);

        dto.RentalObject = _mapper.Map<RentalObjectDTO>(rentalObject);

        return dto;
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class BookingCommands
{
    ///<summary> Создает бронь, результатом выполнения является GUID </summary>
    public class CreateRequest : IRequest<BookingDTO>
    {
        ///<summary> Идентификатор арендатора </summary>
        ///<remarks> Не изменяется, нужен только для поиска </remarks>
        public UserDetailsDTO Tenant { get; set; }
        ///<summary> Идентификатор объекта аренды </summary>
        [Required]
        public Guid RentalObjectId { get; set; }
        ///<summary> Количество взрослых </summary>
        public int AdultCount { get; set; }
        ///<summary> Количество детей </summary>
        public int ChildCount { get; set; }
        ///<summary> Дата заезда </summary>
        public DateOnly CheckinDate { get; set; }
        ///<summary> Дата отъезда </summary>
        public DateOnly CheckoutDate { get; set; }

        ///<summary> Коллекция бронируемых вариантов номеров </summary>
        public IReadOnlyList<BookingRoomVariantCommands.CreateRequest> BookingRooms { get; set; } = new List<BookingRoomVariantCommands.CreateRequest>();
    }
}