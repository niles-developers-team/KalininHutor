using MediatR;
using AutoMapper;

using KalininHutor.Domain.Booking;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Booking.Requests;

internal class CreateRoomVariantHandler : IRequestHandler<CreateRoomVariantRequest, Guid>
{
    private readonly RoomVariantRepository _repository;
    private readonly RentalObjectRepository _rentalObjectRepository;
    private readonly IMapper _mapper;

    public CreateRoomVariantHandler(RoomVariantRepository repository, RentalObjectRepository rentalObjectRepository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _rentalObjectRepository = rentalObjectRepository ?? throw new ArgumentNullException(nameof(rentalObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateRoomVariantRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = _mapper.Map<RentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId));
        var roomVariants = await _repository.Get(new RoomVariantSearchOptions { RentalObjectId = request.RentalObjectId });
        rentalObject.SetRoomVariants(roomVariants.Select(_mapper.Map<RoomVariant>).ToList());

        var result = rentalObject.CreateRoomVariant(request.Name, request.Description,
        request.Price, request.MaxPersonsCount, request.Width, request.Length,
        request.FreeCancellationPeriod, request.PaymentOption, request.Amount, request.FreeAmount);
        await _repository.Create(_mapper.Map<RoomVariantEntity>(result));

        return result.Id;
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
    public decimal Price { get; protected set; }
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