using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Requests;

internal class UpdateRoomVariantHandler : IRequestHandler<UpdateRoomVariantRequest, Unit>
{
    private readonly RoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantHandler(RoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(UpdateRoomVariantRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<RoomVariant>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Description, request.PaymentOption);
        entity.SetPriceAndLimit(request.Price, request.MaxPersonsCount);
        entity.SetSize(request.Width, request.Length);
        entity.SetFreeCancelationPeriod(request.FreeCancellationPeriod);
        entity.SetCounts(request.Count, request.FreeCount);
        await _repository.Update(_mapper.Map<RoomVariantEntity>(entity));
        return Unit.Value;
    }
}

///<summary> Запрос обновления варинта номера </summary>
public class UpdateRoomVariantRequest : IRequest<Unit>
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
}