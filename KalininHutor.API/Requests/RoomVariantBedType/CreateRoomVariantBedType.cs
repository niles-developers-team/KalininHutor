using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Requests;

using DomainRoomVariantBedType = Domain.Booking.RoomVariantBedType;

internal class CreateRoomVariantBedTypeHandler : IRequestHandler<RoomVariantBedType.CreateRequest, Guid>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(RoomVariantBedType.CreateRequest request, CancellationToken cancellationToken)
    {
        var RoomVariantBedType = new DomainRoomVariantBedType(request.RoomVariantId, request.BedType, request.Width, request.Length, request.MaxInRoom);
        await _repository.Create(_mapper.Map<RoomVariantBedTypeEntity>(RoomVariantBedType));

        return RoomVariantBedType.Id;
    }
}

public partial class RoomVariantBedType
{
    ///<summary> Запрос создания варианта кровати номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор номера </summary>
        public Guid RoomVariantId { get; set; }
        ///<summary> Тип кровати </summary>
        public BedTypes BedType { get; set; }
        ///<summary> Ширина кровати </summary>
        public double? Width { get; set; }
        ///<summary> Длина кровати </summary>
        public double? Length { get; set; }
        ///<summary> Максимально в комнате </summary>
        public int MaxInRoom { get; set; }
    }
}