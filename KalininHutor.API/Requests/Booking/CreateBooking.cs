using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Requests;

internal class CreateBookingHandler : IRequestHandler<CreateBookingRequest, Guid>
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

    public async Task<Guid> Handle(CreateBookingRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = _mapper.Map<RentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId));
        var roomVariants = await _roomVariantRepository.Get(new RoomVariantSearchOptions { RentalObjectId = request.RentalObjectId, IncludeBedTypes = true });
        var bookings = await _repository.Get(new BookingSearchOptions { RentalObjectId = request.RentalObjectId });

        rentalObject.SetRoomVariants(roomVariants.Select(_mapper.Map<RoomVariant>).ToList());
        rentalObject.SetBookings(roomVariants.Select(_mapper.Map<Domain.Booking.Booking>).ToList());

        var booking = rentalObject.CreateBooking(request.TenantId, 
            request.CheckinDate, request.CheckoutDate, 
            request.AdultCount, request.ChildCount, 
            request.BookingRooms.Select(_mapper.Map<BookingRoomVariant>).ToList());

        await _repository.Create(_mapper.Map<BookingEntity>(booking));

        return booking.Id;
    }
}

///<summary> Создает бронь, результатом выполнения является GUID </summary>
public class CreateBookingRequest : IRequest<Guid>
{
    ///<summary> Идентификатор арендатора </summary>
    ///<remarks> Не изменяется, нужен только для поиска </remarks>
    public Guid TenantId { get; protected set; }
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
    ///<summary> Количество взрослых </summary>
    public int AdultCount { get; protected set; }
    ///<summary> Количество детей </summary>
    public int ChildCount { get; protected set; }
    ///<summary> Дата заезда </summary>
    public DateOnly CheckinDate { get; protected set; }
    ///<summary> Дата отъезда </summary>
    public DateOnly CheckoutDate { get; protected set; }

    ///<summary> Коллекция бронируемых вариантов номеров </summary>
    public IReadOnlyList<CreateBookingRoomVariantRequest> BookingRooms { get; protected set; }
}