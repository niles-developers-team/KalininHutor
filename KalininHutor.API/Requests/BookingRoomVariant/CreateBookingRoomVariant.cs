using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Requests;

internal class CreateBookingRoomVariantHandler : IRequestHandler<BookingRoomVariantCommands.CreateRequest, Guid>
{
    private readonly BookingRoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public CreateBookingRoomVariantHandler(BookingRoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(BookingRoomVariantCommands.CreateRequest request, CancellationToken cancellationToken)
    {
        var bookingRoomVariant = new BookingRoomVariant(request.RoomVariantId, request.BookingId, request.RoomsCount, request.Amount, request.BedType);
        await _repository.Create(_mapper.Map<BookingRoomVariantEntity>(bookingRoomVariant));

        return bookingRoomVariant.Id;
    }
}

///<summary> Запросы и очереди выбранных номеров </summary>
public partial class BookingRoomVariantCommands
{
    ///<summary> Запрос на создание выбранного варианта номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор брони </summary>
        public Guid BookingId { get; set; }
        ///<summary> Идентификатор варианта номера </summary>
        public Guid RoomVariantId { get; set; }
        ///<summary> Выбранное количество комнат </summary>
        public int RoomsCount { get; set; }
        ///<summary> Всего за комнаты </summary>
        public decimal Amount { get; set; }
        ///<summary> Выбранные варианты кровати </summary>
        public BedTypes BedType { get; set; }
    }
}