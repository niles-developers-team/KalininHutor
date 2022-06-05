using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Booking.Requests;

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
        var bookingRoomVariant = new BookingRoomVariant(request.RoomVariantId, request.Amount);
        await _repository.Create(_mapper.Map<BookingRoomVariantEntity>(bookingRoomVariant));

        return bookingRoomVariant.Id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateBookingRoomVariantRequest : IRequest<Guid>
{
    public Guid RoomVariantId { get; protected set; }
    public decimal Amount { get; protected set; }
}