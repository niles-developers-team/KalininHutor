using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Requests;

using DomainRoomVariant = Domain.Booking.RoomVariant;

internal class UpdateRoomVariantHandler : IRequestHandler<RoomVariant.UpdateRequest, Unit>
{
    private readonly ISender _sender;
    private readonly RoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantHandler(ISender sender, RoomVariantRepository repository, IMapper mapper)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RoomVariant.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<DomainRoomVariant>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Description, request.PaymentOption);
        entity.SetPriceAndLimit(request.Price, request.MaxPersonsCount);
        entity.SetSize(request.Width, request.Length);
        entity.SetFreeCancelationPeriod(request.FreeCancellationPeriod);
        entity.SetCounts(request.Count, request.FreeCount);
        await _repository.Update(_mapper.Map<RoomVariantEntity>(entity));

        if (request.CreateBedTypesRequests != null)
        foreach (var req in request.CreateBedTypesRequests)
        {
            req.RoomVariantId = entity.Id;
            await _sender.Send(req);
        }

        if (request.CreateCharacteristicsRequests != null)
        foreach (var req in request.CreateCharacteristicsRequests)
        {
            req.RoomVariantId = entity.Id;
            await _sender.Send(req);
        }

        if (request.UpdateBedTypesRequests != null)
        foreach (var req in request.UpdateBedTypesRequests)
        {
            await _sender.Send(req);
        }

        if (request.UpdateCharacteristicsRequests != null)
        foreach (var req in request.UpdateCharacteristicsRequests)
        {
            await _sender.Send(req);
        }

        if (request.DeleteBedTypesRequests != null)
            await _sender.Send(request.DeleteBedTypesRequests);

        if (request.DeleteCharacteristicsRequests != null)
            await _sender.Send(request.DeleteCharacteristicsRequests);

        return Unit.Value;
    }
}

///<summary> Запросы и очереди вариантов номеров </summary>
public partial class RoomVariant
{
    ///<summary> Запрос обновления варинта номера </summary>
    public class UpdateRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор варинта номера объекта аренды </summary>
        public Guid Id { get; set; }
        ///<summary> Название </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Описание </summary>
        public string Description { get; set; } = string.Empty;
        ///<summary> Цена за взрослого </summary>
        public decimal Price { get; set; }
        ///<summary> Цена за ребёнка </summary>
        public decimal PriceForChild { get; set; }
        ///<summary> Ширина варианта номера </summary>
        public double Width { get; set; }
        ///<summary> Длина варианта номера </summary>
        public double Length { get; set; }
        ///<summary> Максимально человек в номере </summary>
        public int MaxPersonsCount { get; set; }
        ///<summary> Период бесплатной отмены </summary>
        public int? FreeCancellationPeriod { get; set; }
        ///<summary> Вариант оплаты </summary>
        public PaymentOptions PaymentOption { get; set; }
        ///<summary> Всего номеров </summary>
        public int Count { get; set; }
        ///<summary> Всего номеров свободно </summary>
        public int FreeCount { get; set; }

        public IReadOnlyList<RoomVariantBedType.CreateRequest>? CreateBedTypesRequests { get; set; } = new List<RoomVariantBedType.CreateRequest>();
        public IReadOnlyList<RoomVariantCharacteristic.CreateRequest>? CreateCharacteristicsRequests { get; set; } = new List<RoomVariantCharacteristic.CreateRequest>();

        public IReadOnlyList<RoomVariantBedType.UpdateRequest>? UpdateBedTypesRequests { get; set; } = new List<RoomVariantBedType.UpdateRequest>();
        public IReadOnlyList<RoomVariantCharacteristic.UpdateRequest>? UpdateCharacteristicsRequests { get; set; } = new List<RoomVariantCharacteristic.UpdateRequest>();

        public RoomVariantBedType.DeleteRequest? DeleteBedTypesRequests { get; set; }
        public RoomVariantCharacteristic.DeleteRequest? DeleteCharacteristicsRequests { get; set; }
    }
}