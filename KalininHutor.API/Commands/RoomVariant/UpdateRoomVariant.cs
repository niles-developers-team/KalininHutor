using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Commands;

internal class UpdateRoomVariantHandler : IRequestHandler<RoomVariantCommands.UpdateRequest, Unit>
{
    private readonly ISender _sender;
    private readonly RoomVariantRepository _repository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly RoomVariantCharacteristicRepository _roomCharacteristicsRepository;
    private readonly RoomVariantBedTypeRepository _bedTypesRepository;
    private readonly IMapper _mapper;

    public UpdateRoomVariantHandler(
        ISender sender,
        RoomVariantRepository repository,
        RoomVariantCharacteristicRepository roomCharacteristicsRepository,
        RoomVariantBedTypeRepository bedTypesRepository,
        FileObjectRepository fileObjectRepository,
        IMapper mapper)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _roomCharacteristicsRepository = roomCharacteristicsRepository ?? throw new ArgumentNullException(nameof(roomCharacteristicsRepository));
        _bedTypesRepository = bedTypesRepository ?? throw new ArgumentNullException(nameof(bedTypesRepository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RoomVariantCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<RoomVariant>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Description, request.PaymentOption);
        entity.SetPriceAndLimit(request.Price, request.MaxPersonsCount);
        entity.SetSize(request.Width, request.Length);
        entity.SetFreeCancelationPeriod(request.FreeCancellationPeriod);
        entity.SetCounts(request.Count, request.FreeCount);
        await _repository.Update(_mapper.Map<RoomVariantEntity>(entity));

        if (request.CreateBedTypesRequests.Any())
        {
            foreach (var createBedTypesRequest in request.CreateBedTypesRequests)
                entity.CreateBedType(
                    createBedTypesRequest.BedType,
                    createBedTypesRequest.Width,
                    createBedTypesRequest.Length,
                    createBedTypesRequest.MaxInRoom
                );

            await _bedTypesRepository.CreateBulk(entity.BedTypes.Select(_mapper.Map<RoomVariantBedTypeEntity>).ToList());
        }

        if (request.CreateCharacteristicsRequests.Any())
        {
            foreach (var createCharacteristicRequest in request.CreateCharacteristicsRequests)
                entity.CreateCharacteristic(
                    createCharacteristicRequest.Characteristic,
                    createCharacteristicRequest.Price
                );

            await _roomCharacteristicsRepository.CreateBulk(entity.Characteristics.Select(_mapper.Map<RoomVariantCharacteristicEntity>).ToList());
        }

        foreach (var photoEntity in request.CreatePhotos)
            entity.CreatePhoto(photoEntity.Name, photoEntity.Extension, photoEntity.Body, photoEntity.SortOrder);

        if (entity.Photos.Any())
            await _fileObjectRepository.CreateBulk(entity.Photos.Select(_mapper.Map<FileObjectEntity>).ToList());

        if (request.UpdatePhotos.Any())
            foreach (var photoEntity in request.UpdatePhotos.Select(_mapper.Map<FileObjectEntity>))
                await _fileObjectRepository.Update(photoEntity);

        if (request.DeletePhotos.Any())
            await _fileObjectRepository.Delete(request.DeletePhotos.Select(o => o.Id).ToList());

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
public partial class RoomVariantCommands
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

        ///<summary> Коллекция создания вариантов кроватей </summary>
        public IReadOnlyList<RoomVariantBedTypeCommands.CreateRequest>? CreateBedTypesRequests { get; set; } = new List<RoomVariantBedTypeCommands.CreateRequest>();
        ///<summary> Коллекция создания характеристик номеров </summary>
        public IReadOnlyList<RoomVariantCharacteristicCommands.CreateRequest>? CreateCharacteristicsRequests { get; set; } = new List<RoomVariantCharacteristicCommands.CreateRequest>();

        ///<summary> Коллекция редактирования вариантов кроватей </summary>
        public IReadOnlyList<RoomVariantBedTypeCommands.UpdateRequest>? UpdateBedTypesRequests { get; set; } = new List<RoomVariantBedTypeCommands.UpdateRequest>();
        ///<summary> Коллекция редактирования вариантов кроватей </summary>
        public IReadOnlyList<RoomVariantCharacteristicCommands.UpdateRequest>? UpdateCharacteristicsRequests { get; set; } = new List<RoomVariantCharacteristicCommands.UpdateRequest>();

        ///<summary> Коллекция удаления вариантов кроватей </summary>
        public RoomVariantBedTypeCommands.DeleteRequest? DeleteBedTypesRequests { get; set; }
        ///<summary> Коллекция удаления вариантов кроватей </summary>
        public RoomVariantCharacteristicCommands.DeleteRequest? DeleteCharacteristicsRequests { get; set; }
        ///<summary> Коллекция фотографий для создания </summary>
        public IReadOnlyList<FileObjectDTO> CreatePhotos { get; set; } = new List<FileObjectDTO>();
        ///<summary> Коллекция фотографий для создания </summary>
        public IReadOnlyList<FileObjectDTO> UpdatePhotos { get; set; } = new List<FileObjectDTO>();
        ///<summary> Коллекция фотографий для удаления </summary>
        public IReadOnlyList<FileObjectDTO> DeletePhotos { get; set; } = new List<FileObjectDTO>();
    }
}