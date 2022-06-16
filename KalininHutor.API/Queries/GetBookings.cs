using System.ComponentModel.DataAnnotations;
using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetBookingsHandler : IRequestHandler<BookingQueries.GetQuery, IEnumerable<BookingDTO>>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;

    public GetBookingsHandler(BookingRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<BookingDTO>> Handle(BookingQueries.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<BookingSearchOptions>(request));
        return result.Select(_mapper.Map<BookingDTO>).ToList();
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class BookingQueries
{
    ///<summary> Очередь получения брони </summary>
    public class GetQuery : IRequest<IEnumerable<BookingDTO>>
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
}