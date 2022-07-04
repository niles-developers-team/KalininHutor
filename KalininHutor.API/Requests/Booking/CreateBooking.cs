using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using System.ComponentModel.DataAnnotations;

namespace KalininHutor.API.Requests;

using DomainRentalObject = Domain.Booking.RentalObject;
using DomainBooking = Domain.Booking.Booking;
using DomainBookingVariant = Domain.Booking.BookingRoomVariant;
using DomainRoomVariant = Domain.Booking.RoomVariant;

internal class CreateBookingHandler : IRequestHandler<BookingRequests.CreateRequest, Guid>
{
    private readonly BookingRepository _repository;
    private readonly RentalObjectRepository _rentalObjectRepository;
    private readonly RoomVariantRepository _roomVariantRepository;
    private readonly IMapper _mapper;

    public CreateBookingHandler(BookingRepository repository, RentalObjectRepository rentalObjectRepository, RoomVariantRepository roomVariantRepository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _rentalObjectRepository = rentalObjectRepository ?? throw new ArgumentNullException(nameof(rentalObjectRepository));
        _roomVariantRepository = roomVariantRepository ?? throw new ArgumentNullException(nameof(roomVariantRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(BookingRequests.CreateRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = _mapper.Map<DomainRentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId));
        var roomVariants = await _roomVariantRepository.Get(new RoomVariantSearchOptions { RentalObjectId = request.RentalObjectId });
        var bookings = await _repository.Get(new BookingSearchOptions { RentalObjectId = request.RentalObjectId });

        rentalObject.SetRoomVariants(roomVariants.Select(_mapper.Map<DomainRoomVariant>).ToList());
        rentalObject.SetBookings(roomVariants.Select(_mapper.Map<DomainBooking>).ToList());

        var booking = rentalObject.CreateBooking(request.TenantId,
            request.CheckinDate, request.CheckoutDate,
            request.AdultCount, request.ChildCount,
            request.BookingRooms.Select(_mapper.Map<DomainBookingVariant>).ToList());

        await _repository.Create(_mapper.Map<BookingEntity>(booking));

        return booking.Id;
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class BookingRequests
{
    ///<summary> Создает бронь, результатом выполнения является GUID </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор арендатора </summary>
        ///<remarks> Не изменяется, нужен только для поиска </remarks>
        [Required]
        public Guid TenantId { get; set; }
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
        public IReadOnlyList<BookingRoomVariantRequests.CreateRequest> BookingRooms { get; set; } = new List<BookingRoomVariantRequests.CreateRequest>();
    }
}