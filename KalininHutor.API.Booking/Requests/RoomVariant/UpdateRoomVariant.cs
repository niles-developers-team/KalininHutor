using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Booking.Requests;

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
        var RoomVariants = await _repository.Get(new RoomVariantSearchOptions { Id = request.Id });
        var entity = _mapper.Map<RoomVariant>(RoomVariants.SingleOrDefault());
        entity.SetInfo(request.Name, request.Description, request.PaymentOption);
        entity.SetPricesAndLimit(request.PriceForAdult, request.PriceForChild, request.MaxPersonsCount);
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
    public Guid Id { get; protected set; }
    ///<summary> Название </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<summary> Описание </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<summary> Цена за взрослого </summary>
    public decimal PriceForAdult { get; protected set; }
    ///<summary> Цена за ребёнка </summary>
    public decimal PriceForChild { get; protected set; }
    ///<summary> Ширина варианта номера </summary>
    public double Width { get; protected set; }
    ///<summary> Длина варианта номера </summary>
    public double Length { get; protected set; }
    ///<summary> Максимально человек в номере </summary>
    public int MaxPersonsCount { get; protected set; }
    ///<summary> Период бесплатной отмены </summary>
    public int? FreeCancellationPeriod { get; protected set; }
    ///<summary> Вариант оплаты </summary>
    public PaymentOptions PaymentOption { get; protected set; }
    ///<summary> Всего номеров </summary>
    public int Count { get; protected set; }
    ///<summary> Всего номеров свободно </summary>
    public int FreeCount { get; protected set; }
}