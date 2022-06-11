using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Requests;

using DomainBooking = Domain.Booking.Booking;

internal class UpdateBookingHandler : IRequestHandler<Booking.UpdateRequest, Unit>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;

    public UpdateBookingHandler(BookingRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(Booking.UpdateRequest request, CancellationToken cancellationToken)
    {
        var Bookings = await _repository.Get(new BookingSearchOptions { Id = request.Id });
        var entity = _mapper.Map<DomainBooking>(Bookings.SingleOrDefault());
        entity.SetVisitorsCount(request.AdultCount, request.ChildsCount);
        entity.SetBookingDates(request.CheckinDate, request.CheckoutDate);
        await _repository.Update(_mapper.Map<BookingEntity>(entity));
        return Unit.Value;
    }
}

public partial class Booking
{
    ///<summary> Запрос обновления объекта аренды </summary>
    public class UpdateRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        ///<remarks> Не изменяется, нужен только для поиска </remarks>
        public Guid Id { get; set; }

        ///<summary> Название объекта аренды </summary>
        public int AdultCount { get; set; }

        ///<summary> Идентификатор объекта аренды </summary>
        public int ChildsCount { get; set; }

        ///<summary> Идентификатор объекта аренды </summary>
        public DateOnly CheckinDate { get; set; }

        ///<summary> Идентификатор объекта аренды </summary>
        public DateOnly CheckoutDate { get; set; }
    }
}