using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Requests;

using DomainBookingVariant = Domain.Booking.BookingRoomVariant;

internal class CreateBookingRoomVariantHandler : IRequestHandler<BookingRoomVariant.CreateRequest, Guid>
{
    private readonly BookingRoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public CreateBookingRoomVariantHandler(BookingRoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(BookingRoomVariant.CreateRequest request, CancellationToken cancellationToken)
    {
        var bookingRoomVariant = new DomainBookingVariant(request.RoomVariantId, request.BookingId, request.Amount);
        await _repository.Create(_mapper.Map<BookingRoomVariantEntity>(bookingRoomVariant));

        return bookingRoomVariant.Id;
    }
}

public partial class BookingRoomVariant
{
    ///<summary> Запрос на создание выбранного варианта номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор брони </summary>
        public Guid BookingId { get; set; }
        ///<summary> Идентификатор варианта номера </summary>
        public Guid RoomVariantId { get; set; }
        ///<summary> </summary>
        public decimal Amount { get; set; }

        ///<summary> Выбранные типы кроватей </summary>
        public IReadOnlyList<BookingBedType.CreateRequest> BedTypes { get; set; } = new List<BookingBedType.CreateRequest>();
    }
}