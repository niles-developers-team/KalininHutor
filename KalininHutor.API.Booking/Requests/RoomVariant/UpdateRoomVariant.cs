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

///<summary> Запрос обновления объекта аренды </summary>
public class UpdateRoomVariantRequest : IRequest<Unit>
{
    public Guid Id { get; protected set; }
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
    public int Count { get; protected set; }
    public int FreeCount { get; protected set; }
}