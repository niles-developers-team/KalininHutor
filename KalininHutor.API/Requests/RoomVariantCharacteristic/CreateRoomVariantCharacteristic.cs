using MediatR;
using AutoMapper;
using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Requests;

using DomainRoomVariantCharacteristic = Domain.Booking.RoomVariantCharacteristic;

internal class CreateRoomVariantCharacteristicHandler : IRequestHandler<RoomVariantCharacteristic.CreateRequest, Guid>
{
    private readonly RoomVariantCharacteristicRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomVariantCharacteristicHandler(RoomVariantCharacteristicRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(RoomVariantCharacteristic.CreateRequest request, CancellationToken cancellationToken)
    {
        if(!request.RoomVariantId.HasValue) {
            throw new ApplicationException("Не указан вариант номера");
        }
        var RoomVariantCharacteristic = new DomainRoomVariantCharacteristic(request.RoomVariantId.Value, request.RoomCharacteristicId, request.Price);
        await _repository.Create(_mapper.Map<RoomVariantCharacteristicEntity>(RoomVariantCharacteristic));

        return RoomVariantCharacteristic.Id;
    }
}


///<summary> Запросы и очереди характеристик вариантов номеров </summary>
public partial class RoomVariantCharacteristic
{
    ///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
        ///<summary> Идентификатор характеристики </summary>
        public Guid RoomCharacteristicId { get; set; }
        ///<summary> Цена за услугу или удобство </summary>
        public decimal? Price { get; set; }
    }
}