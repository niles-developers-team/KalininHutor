using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain;
using KalininHutor.Domain.Booking;
using MediatR;

namespace KalininHutor.API.Commands;

internal class UpdateRentalObjectHandler : IRequestHandler<RentalObjectCommands.UpdateRequest, RentalObjectDTO>
{
    private readonly ISender _sender;
    private readonly RentalObjectRepository _repository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly IMapper _mapper;

    public UpdateRentalObjectHandler(ISender sender, RentalObjectRepository repository, FileObjectRepository fileObjectRepository, IMapper mapper)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<RentalObjectDTO> Handle(RentalObjectCommands.UpdateRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<RentalObject>(await _repository.Get(request.Id));
        entity.SetInfo(request.Name, request.Description, request.Address);
        entity.SetCheckTime(request.CheckinTime, request.CheckoutTime);
        entity.SetCoordinates(_mapper.Map<Coordinates>(request.Coordinates));

        await _repository.Update(_mapper.Map<RentalObjectEntity>(entity));

        if (request.CreateRoomVariantsRequests != null)
            foreach (var req in request.CreateRoomVariantsRequests)
            {
                req.RentalObject = entity;
                await _sender.Send(req);
            }

        if (request.UpdateRoomVariantsRequests != null)
            foreach (var req in request.UpdateRoomVariantsRequests)
                await _sender.Send(req);

        if (request.DeleteRoomVariantsRequest != null)
            await _sender.Send(request.DeleteRoomVariantsRequest);

        if (request.CreatePhotos.Any())
        {
            foreach (var photoEntity in request.CreatePhotos)
                entity.CreatePhoto(photoEntity.Name, photoEntity.Extension, photoEntity.Body, photoEntity.SortOrder);

            await _fileObjectRepository.CreateBulk(entity.Photos.Select(_mapper.Map<FileObjectEntity>).ToList());
        }

        if (request.UpdatePhotos.Any())
            foreach (var photoEntity in request.UpdatePhotos.Select(_mapper.Map<FileObjectEntity>))
                await _fileObjectRepository.Update(photoEntity);

        if (request.DeletePhotos.Any())
            await _fileObjectRepository.Delete(request.DeletePhotos.Select(o => o.Id).ToList());

        return _mapper.Map<RentalObjectDTO>(entity);
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
{
    ///<summary> Запрос обновления объекта аренды </summary>
    public class UpdateRequest : IRequest<RentalObjectDTO>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        ///<remarks> Не изменяется, нужен только для поиска </remarks>
        public Guid Id { get; set; }

        ///<summary> Название объекта аренды </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary> Адрес объекта аренды </summary>
        /// <value></value>
        public string Address { get; set; }

        ///<summary> Описание объекта аренды </summary>
        public string Description { get; set; } = string.Empty;

        ///<summary> Время заезда </summary>
        public TimeOnly CheckinTime { get; set; }

        ///<summary> Время выезда </summary>
        public TimeOnly CheckoutTime { get; set; }

        /// <summary> Координаты </summary>
        /// <value></value>
        public CoordinatesDTO? Coordinates { get; set; }

        ///<summary> Коллекция создания вариантов номеров </summary>
        public IReadOnlyList<RoomVariantCommands.CreateRequest>? CreateRoomVariantsRequests { get; set; } = new List<RoomVariantCommands.CreateRequest>();
        ///<summary> Коллекция редактирования вариантов номеров </summary>
        public IReadOnlyList<RoomVariantCommands.UpdateRequest>? UpdateRoomVariantsRequests { get; set; } = new List<RoomVariantCommands.UpdateRequest>();
        ///<summary> Коллекция удаления вариантов номеров </summary>
        public RoomVariantCommands.DeleteRequest? DeleteRoomVariantsRequest { get; set; }
        ///<summary> Коллекция фотографий для создания </summary>
        public IReadOnlyList<FileObjectDTO> CreatePhotos { get; set; } = new List<FileObjectDTO>();
        ///<summary> Коллекция фотографий для создания </summary>
        public IReadOnlyList<FileObjectDTO> UpdatePhotos { get; set; } = new List<FileObjectDTO>();
        ///<summary> Коллекция фотографий для удаления </summary>
        public IReadOnlyList<FileObjectDTO> DeletePhotos { get; set; } = new List<FileObjectDTO>();
    }
}