using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Commands;

internal class UpdateBookingHandler : IRequestHandler<BookingCommands.UpdateRequest, BookingDTO>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;

    public UpdateBookingHandler(BookingRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<BookingDTO> Handle(BookingCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<Booking>(await _repository.Get(request.Id));
        entity.SetVisitorsCount(request.AdultCount, request.ChildsCount);
        entity.SetBookingDates(request.CheckinDate, request.CheckoutDate);
        await _repository.Update(_mapper.Map<BookingEntity>(entity));
        return _mapper.Map<BookingDTO>(entity);
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class BookingCommands
{
    ///<summary> Запрос обновления объекта аренды </summary>
    public class UpdateRequest : IRequest<BookingDTO>
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