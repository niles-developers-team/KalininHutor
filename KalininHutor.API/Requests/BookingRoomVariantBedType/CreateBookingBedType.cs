using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Requests;

internal class CreateBookingRoomVariantBedTypeHandler : IRequestHandler<CreateBookingRoomVariantBedTypeRequest, Guid>
{
    private readonly BookingRoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public CreateBookingRoomVariantBedTypeHandler(BookingRoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateBookingRoomVariantBedTypeRequest request, CancellationToken cancellationToken)
    {
        var BookingRoomVariantBedType = new BookingBedType(request.BookingRoomVariantId, request.BedTypeId, request.Count);
        await _repository.Create(_mapper.Map<BookingRoomVariantBedTypeEntity>(BookingRoomVariantBedType));

        return BookingRoomVariantBedType.Id;
    }
}

///<summary> Запрос на создание выбранной кровати в номере </summary>
public class CreateBookingRoomVariantBedTypeRequest : IRequest<Guid>
{
    ///<summary> Идентификатор выбранного номера </summary>
    public Guid BookingRoomVariantId { get; set; }
    ///<summary> Выбранный тип кровати </summary>
    public Guid BedTypeId { get; set; }
    ///<summary> Количество кроватей выбранного типа </summary>
    public int Count { get; set; }
}