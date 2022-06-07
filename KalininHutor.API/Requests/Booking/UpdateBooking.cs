using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

internal class UpdateBookingHandler : IRequestHandler<UpdateBookingRequest, Unit>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;

    public UpdateBookingHandler(BookingRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(UpdateBookingRequest request, CancellationToken cancellationToken)
    {
        var Bookings = await _repository.Get(new BookingSearchOptions { Id = request.Id });
        var entity = _mapper.Map<Domain.Booking.Booking>(Bookings.SingleOrDefault());
        entity.SetVisitorsCount(request.AdultCount, request.ChildsCount);
        entity.SetBookingDates(request.CheckinDate, request.CheckoutDate);
        await _repository.Update(_mapper.Map<BookingEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запрос обновления объекта аренды </summary>
public class UpdateBookingRequest : IRequest<Unit>
{
    ///<summary> Идентификатор объекта аренды </summary>
    ///<remarks> Не изменяется, нужен только для поиска </remarks>
    public Guid Id { get; protected set; }
    
    ///<summary> Название объекта аренды </summary>
    public int AdultCount { get; set; }
    
    ///<summary> Идентификатор объекта аренды </summary>
    public int ChildsCount { get; set; }
    
    ///<summary> Идентификатор объекта аренды </summary>
    public DateOnly CheckinDate { get; set; }
    
    ///<summary> Идентификатор объекта аренды </summary>
    public DateOnly CheckoutDate { get; set; }
}