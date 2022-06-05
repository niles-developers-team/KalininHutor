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

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateRoomVariantRequest : IRequest<Guid>
{
    public Guid RentalObjectId { get; protected set; }
    public string Name { get; protected set; } = string.Empty;
    public string Description { get; protected set; } = string.Empty;
    public decimal PriceForAdult { get; protected set; }
    public decimal PriceForChild { get; protected set; }
    public double Width { get; protected set; }
    public double Length { get; protected set; }
    public int MaxPersonsCount { get; protected set; }
    public int? FreeCancellationPeriod { get; protected set; }
    public PaymentOptions PaymentOption { get; protected set; }
    public int Amount { get; protected set; }
    public int FreeAmount { get; protected set; }
}