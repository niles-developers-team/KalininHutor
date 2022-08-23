using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Requests;

internal class CreateRoomVariantBedTypeHandler : IRequestHandler<RoomVariantBedTypeCommands.CreateRequest, Guid>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomVariantBedTypeHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(RoomVariantBedTypeCommands.CreateRequest request, CancellationToken cancellationToken)
    {
        if (!request.RoomVariantId.HasValue)
        {
            throw new ApplicationException("Не указан вариант номера");
        }
        var roomVariantBedType = new RoomVariantBedType(request.RoomVariantId.Value, request.BedType, request.Width, request.Length, request.MaxInRoom);
        await _repository.Create(_mapper.Map<RoomVariantBedTypeEntity>(roomVariantBedType));

        return roomVariantBedType.Id;
    }
}

///<summary> Запросы и очереди вариантов кроватей </summary>
public partial class RoomVariantBedTypeCommands
{
    ///<summary> Запрос создания варианта кровати номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
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