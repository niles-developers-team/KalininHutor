using System.Collections.Generic;

using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using Newtonsoft.Json;

namespace KalininHutor.API.Requests;

using DomainRentalObject = Domain.Booking.RentalObject;
using DomainRoomVariant = Domain.Booking.RoomVariant;

internal class CreateRoomVariantHandler : IRequestHandler<RoomVariant.CreateRequest, Guid>
{
    private readonly ISender _sender;
    private readonly RoomVariantRepository _repository;
    private readonly RentalObjectRepository _rentalObjectRepository;
    private readonly IMapper _mapper;

    public CreateRoomVariantHandler(ISender sender, RoomVariantRepository repository, RentalObjectRepository rentalObjectRepository, IMapper mapper)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _rentalObjectRepository = rentalObjectRepository ?? throw new ArgumentNullException(nameof(rentalObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(RoomVariant.CreateRequest request, CancellationToken cancellationToken)
    {
        if (request.RentalObject == null)
        {
            if (!request.RentalObjectId.HasValue)
                throw new ApplicationException("Не указан объект аренды");

            request.RentalObject = _mapper.Map<DomainRentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId.Value));
        }

        if (request.RentalObject.RoomVariants == null || !request.RentalObject.RoomVariants.Any())
        {
            var roomVariants = await _repository.Get(new RoomVariantSearchOptions { RentalObjectId = request.RentalObject.Id });
            request.RentalObject.SetRoomVariants(roomVariants.Select(_mapper.Map<DomainRoomVariant>).ToList());
        }

        var result = request.RentalObject.CreateRoomVariant(request.Name, request.Description,
        request.Price, request.MaxPersonsCount, request.Width, request.Length,
        request.FreeCancellationPeriod, request.PaymentOption, request.Count, request.FreeCount);
        await _repository.Create(_mapper.Map<RoomVariantEntity>(result));


        foreach (var createBedTypesRequest in request.CreateBedTypesRequests)
        {
            createBedTypesRequest.RoomVariantId = result.Id;
            await _sender.Send(createBedTypesRequest);
        }

        foreach (var createCharacteristicRequest in request.CreateCharacteristicsRequests)
        {
            createCharacteristicRequest.RoomVariantId = result.Id;
            await _sender.Send(createCharacteristicRequest);
        }

        return result.Id;
    }
}

///<summary> Запросы и очереди вариантов номеров </summary>
public partial class RoomVariant
{
    ///<summary> Запрос на создание варианта номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        internal DomainRentalObject RentalObject { get; set; }
        ///<summary> Идентификатор объекта аренды </summary>
        public Guid? RentalObjectId { get; set; }
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

        public IReadOnlyList<RoomVariantBedType.CreateRequest> CreateBedTypesRequests { get; set; } = new List<RoomVariantBedType.CreateRequest>();
        public IReadOnlyList<RoomVariantCharacteristic.CreateRequest> CreateCharacteristicsRequests { get; set; } = new List<RoomVariantCharacteristic.CreateRequest>();
    }
}