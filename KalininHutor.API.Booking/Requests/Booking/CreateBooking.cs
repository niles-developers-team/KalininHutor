using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Booking.Requests;

internal class CreateBookingHandler : IRequestHandler<CreateBookingRequest, Guid>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;

    public CreateBookingHandler(BookingRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateBookingRequest request, CancellationToken cancellationToken)
    {
        var booking = new Domain.Booking.Booking(request.RentalObjectId, request.TenantId,
                        request.AdultCount, request.ChildCount,
                        request.CheckinDate, request.CheckoutDate);
        await _repository.Create(_mapper.Map<BookingEntity>(booking));

        return booking.Id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
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
}