using System.Collections.Generic;

using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using KalininHutor.Domain.Booking;
using KalininHutor.API.DTO;
using KalininHutor.DAL;

namespace KalininHutor.API.Commands;

internal class CreateRoomVariantHandler : IRequestHandler<RoomVariantCommands.CreateRequest, Guid>
{
    private readonly ISender _sender;
    private readonly RoomVariantRepository _repository;
    private readonly RentalObjectRepository _rentalObjectRepository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly RoomVariantCharacteristicRepository _roomCharacteristicsRepository;
    private readonly RoomVariantBedTypeRepository _bedTypesRepository;
    private readonly IMapper _mapper;

    public CreateRoomVariantHandler(
        ISender sender, 
        RoomVariantRepository repository,
        RentalObjectRepository rentalObjectRepository, 
        RoomVariantCharacteristicRepository roomCharacteristicsRepository,
        RoomVariantBedTypeRepository bedTypesRepository,
        FileObjectRepository fileObjectRepository, 
        IMapper mapper
    )
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _rentalObjectRepository = rentalObjectRepository ?? throw new ArgumentNullException(nameof(rentalObjectRepository));
        _roomCharacteristicsRepository = roomCharacteristicsRepository ?? throw new ArgumentNullException(nameof(roomCharacteristicsRepository));
        _bedTypesRepository = bedTypesRepository ?? throw new ArgumentNullException(nameof(bedTypesRepository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(RoomVariantCommands.CreateRequest request, CancellationToken cancellationToken)
    {
        if (request.RentalObject == null)
        {
            if (!request.RentalObjectId.HasValue)
                throw new ApplicationException("Не указан объект аренды");

            request.RentalObject = _mapper.Map<RentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId.Value));
        }

        if (request.RentalObject.RoomVariants == null || !request.RentalObject.RoomVariants.Any())
        {
            var roomVariants = await _repository.Get(new RoomVariantSearchOptions { RentalObjectId = request.RentalObject.Id });
            request.RentalObject.SetRoomVariants(roomVariants.Select(_mapper.Map<RoomVariant>).ToList());
        }

        var result = request.RentalObject.CreateRoomVariant(request.Name, request.Description,
        request.Price, request.MaxPersonsCount, request.Width, request.Length,
        request.FreeCancellationPeriod, request.PaymentOption, request.Count, request.FreeCount);
        await _repository.Create(_mapper.Map<RoomVariantEntity>(result));

        foreach (var createBedTypesRequest in request.CreateBedTypesRequests)
            result.CreateBedType(
                createBedTypesRequest.BedType,
                createBedTypesRequest.Width,
                createBedTypesRequest.Length,
                createBedTypesRequest.MaxInRoom
            );

        await _bedTypesRepository.CreateBulk(result.BedTypes.Select(_mapper.Map<RoomVariantBedTypeEntity>).ToList());

        foreach (var createCharacteristicRequest in request.CreateCharacteristicsRequests)
            result.CreateCharacteristic(
                createCharacteristicRequest.Characteristic,
                createCharacteristicRequest.Price
            );

        await _roomCharacteristicsRepository.CreateBulk(result.Characteristics.Select(_mapper.Map<RoomVariantCharacteristicEntity>).ToList());

        foreach (var photoEntity in request.CreatePhotos)
            result.CreatePhoto(photoEntity.Name, photoEntity.Extension, photoEntity.Body, photoEntity.SortOrder);

        await _fileObjectRepository.CreateBulk(result.Photos.Select(_mapper.Map<FileObjectEntity>).ToList());

        return result.Id;
    }
}

///<summary> Запросы и очереди вариантов номеров </summary>
public partial class RoomVariantCommands
{
    ///<summary> Запрос на создание варианта номера </summary>
    public class CreateRequest : IRequest<Guid>
    {
        internal RentalObject? RentalObject { get; set; }
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

        ///<summary> Коллекция создания вариантов кроватей </summary>
        public IReadOnlyList<RoomVariantBedTypeCommands.CreateRequest> CreateBedTypesRequests { get; set; } = new List<RoomVariantBedTypeCommands.CreateRequest>();
        ///<summary> Коллекция создания характеристик номеров </summary>
        public IReadOnlyList<RoomVariantCharacteristicCommands.CreateRequest> CreateCharacteristicsRequests { get; set; } = new List<RoomVariantCharacteristicCommands.CreateRequest>();
        ///<summary> Коллекция фотографий </summary>
        public IReadOnlyList<FileObjectDTO> CreatePhotos { get; set; } = new List<FileObjectDTO>();
    }
}