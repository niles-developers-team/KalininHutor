using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Booking.Requests;

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
        var BookingRoomVariantBedType = new BookingBedType(request.RoomVariantId, request.BedType, request.Count);
        await _repository.Create(_mapper.Map<BookingRoomVariantBedTypeEntity>(BookingRoomVariantBedType));

        return BookingRoomVariantBedType.Id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateBookingRoomVariantBedTypeRequest : IRequest<Guid>
{
    ///<summary> </summary>
    public Guid RoomVariantId { get; protected set; }
    ///<summary> </summary>
    public BedTypes BedType { get; set; }
    ///<summary> </summary>
    public int Count { get; protected set; }
}