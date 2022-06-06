using MediatR;
using AutoMapper;

using KalininHutor.Domain.Booking;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Booking.Requests;

internal class CreateRoomVariantHandler : IRequestHandler<CreateRoomVariantRequest, Guid>
{
    private readonly RoomVariantRepository _repository;
    private readonly IMapper _mapper;

    public CreateRoomVariantHandler(RoomVariantRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateRoomVariantRequest request, CancellationToken cancellationToken)
    {
        var RoomVariant = new RoomVariant(request.RentalObjectId, request.Name, request.Description,
        request.PriceForAdult, request.PriceForChild, request.MaxPersonsCount, request.Width, request.Length,
        request.FreeCancellationPeriod, request.PaymentOption, request.Amount, request.FreeAmount);
        await _repository.Create(_mapper.Map<RoomVariantEntity>(RoomVariant));

        return RoomVariant.Id;
    }
}

///<summary> Запрос на создание варианта номера </summary>
public class CreateRoomVariantRequest : IRequest<Guid>
{
    ///<summary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
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
    public int Amount { get; protected set; }
    ///<summary> Всего номеров свободно </summary>
    public int FreeAmount { get; protected set; }
}