using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Requests;

using DomainBookingBedType = Domain.Booking.BookingBedType;

internal class CreateBookingRoomVariantBedTypeHandler : IRequestHandler<BookingBedType.CreateRequest, Guid>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public CreateBookingRoomVariantBedTypeHandler(BookingRoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(BookingBedType.CreateRequest request, CancellationToken cancellationToken)
    {
        var BookingRoomVariantBedType = new DomainBookingBedType(request.BookingRoomVariantId, request.BedTypeId, request.Count);
        await _repository.Create(_mapper.Map<BookingRoomVariantBedTypeEntity>(BookingRoomVariantBedType));

        return BookingRoomVariantBedType.Id;
    }
}

///<summary> Запросы и очереди выбранных вариантов кроватей </summary>
public partial class BookingBedType
{
    ///<summary> Запрос на создание выбранной кровати в номере </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор выбранного номера </summary>
        public Guid BookingRoomVariantId { get; set; }
        ///<summary> Выбранный тип кровати </summary>
        public Guid BedTypeId { get; set; }
        ///<summary> Количество кроватей выбранного типа </summary>
        public int Count { get; set; }
    }
}