using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;

namespace KalininHutor.API.Requests;

using DomainRentalObject = Domain.Booking.RentalObject;
using DomainRoomVariant = Domain.Booking.RoomVariant;

internal class CreateRoomVariantHandler : IRequestHandler<RoomVariant.CreateRequest, Guid>
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

    public async Task<Guid> Handle(RoomVariant.CreateRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = _mapper.Map<DomainRentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId));
        var roomVariants = await _repository.Get(new RoomVariantSearchOptions { RentalObjectId = request.RentalObjectId });
        rentalObject.SetRoomVariants(roomVariants.Select(_mapper.Map<DomainRoomVariant>).ToList());

        var result = rentalObject.CreateRoomVariant(request.Name, request.Description,
        request.Price, request.MaxPersonsCount, request.Width, request.Length,
        request.FreeCancellationPeriod, request.PaymentOption, request.Count, request.FreeCount);
        await _repository.Create(_mapper.Map<RoomVariantEntity>(result));

        return result.Id;
    }
}

public partial class RoomVariant
{
    ///<summary> Запрос на создание варианта номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid RentalObjectId { get; set; }
        ///<summary> Название </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Описание </summary>
        public string Description { get; set; } = string.Empty;
        ///<summary> Цена </summary>
        public decimal Price { get; set; }
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
}