using System.ComponentModel.DataAnnotations;
using AutoMapper;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetBookingsHandler : IRequestHandler<Booking.GetQuery, IEnumerable<Booking.GetResponse>>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingsHandler(BookingRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<Booking.GetResponse>> Handle(Booking.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingSearchOptions>(request));
        return result.Select(_mapper.Map<Booking.GetResponse>).ToList();
    }
}

public partial class Booking
{
    ///<summary> Очередь получения брони </summary>
    public class GetQuery : IRequest<IEnumerable<GetResponse>>
    {
        ///<summary> Идентификатор брони </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор арендатора </summary>
        [Required]
        public Guid? TenantId { get; set; }
        ///<summary> Поисковая строка </summary>
        public string? SearchText { get; set; }
        ///<summary> Дата заезда </summary>
        public DateOnly? CheckinDate { get; set; }
        ///<summary> Дата отъезда </summary>
        public DateOnly? CheckoutDate { get; set; }
    }

    ///<summary> Модель чтения брони </summary>
    public class GetResponse
    {
        ///<summary> Идентификатор брони </summary>
        public Guid Id { get; protected set; }
        ///<summary> Идентификатор арендатора </summary>
        public Guid TenantId { get; protected set; }
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid RentalObjectId { get; protected set; }
        ///<summary> Количество взрослых </summary>
        public int AdultCount { get; protected set; }
        ///<summary> Количество детей </summary>
        public int ChildCount { get; protected set; }
        ///<summary> Всего за бронь (руб.) </summary>
        public decimal Total { get; protected set; }
        ///<summary> Дата заезда </summary>
        public DateOnly CheckinDate { get; set; }
        ///<summary> Дата отъезда </summary>
        public DateOnly CheckoutDate { get; set; }
    }
}