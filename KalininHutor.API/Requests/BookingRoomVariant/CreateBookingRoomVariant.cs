using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Requests;

internal class CreateBookingRoomVariantHandler : IRequestHandler<CreateBookingRoomVariantRequest, Guid>
{
    private readonly BookingRoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public CreateBookingRoomVariantHandler(BookingRoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateBookingRoomVariantRequest request, CancellationToken cancellationToken)
    {
        var bookingRoomVariant = new BookingRoomVariant(request.RoomVariantId, request.BookingId, request.Amount);
        await _repository.Create(_mapper.Map<BookingRoomVariantEntity>(bookingRoomVariant));

        return bookingRoomVariant.Id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateBookingRoomVariantRequest : IRequest<Guid>
{
    ///<summary> Идентификатор брони </summary>
    public Guid BookingId { get; protected set; }
    ///<summary> Идентификатор варианта номера </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> </summary>
    public decimal Amount { get; protected set; }

    public IReadOnlyList<CreateBookingRoomVariantBedTypeRequest> BedTypes { get; protected set; }
}