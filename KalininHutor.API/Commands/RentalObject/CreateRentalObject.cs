using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;
using KalininHutor.API.DTO;
using KalininHutor.Domain.Booking;
using KalininHutor.DAL;

namespace KalininHutor.API.Commands;

internal class CreateRentalObjectHandler : IRequestHandler<RentalObjectCommands.CreateRequest, RentalObjectDTO>
{
    private readonly ISender _sender;
    private readonly RentalObjectRepository _repository;
    private readonly FileObjectRepository _fileObjectRepository;
    private readonly IMapper _mapper;

    public CreateRentalObjectHandler(ISender sender, RentalObjectRepository repository, FileObjectRepository fileObjectRepository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _fileObjectRepository = fileObjectRepository ?? throw new ArgumentNullException(nameof(fileObjectRepository));
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<RentalObjectDTO> Handle(RentalObjectCommands.CreateRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = new RentalObject(request.Name, request.Description,
                        request.Address, request.CheckinTime, request.CheckoutTime, request.LandlordId);
        await _repository.Create(_mapper.Map<RentalObjectEntity>(rentalObject));

        foreach (var createRoomVariantsRequest in request.CreateRoomVariantsRequests)
        {
            createRoomVariantsRequest.RentalObject = rentalObject;
            await _sender.Send(createRoomVariantsRequest);
        }

        foreach (var photoEntity in request.CreatePhotos)
            rentalObject.CreatePhoto(photoEntity.Name, photoEntity.Extension, photoEntity.Body, photoEntity.SortOrder);

        await _fileObjectRepository.CreateBulk(rentalObject.Photos.Select(_mapper.Map<FileObjectEntity>).ToList());

        return _mapper.Map<RentalObjectDTO>(rentalObject);
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
{
    ///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
    public class CreateRequest : IRequest<RentalObjectDTO>
    {
        ///<summary> Название объекта аренды </summary>
        public string Name { get; set; } = string.Empty;
        ///<summary> Описание объекта аренды </summary>
        public string Description { get; set; } = string.Empty;
        ///<summary> Адрес объекта аренды </summary>
        public string? Address { get; set; }

        ///<summary> Идентификатор владельца </summary>
        public Guid LandlordId { get; set; }

        ///<summary> Время заезда </summary>
        public TimeOnly? CheckinTime { get; set; }
        ///<summary> Время отъезда </summary>
        public TimeOnly? CheckoutTime { get; set; }

        ///<summary> Коллекция вариантов номеров к созданию </summary>
        public IReadOnlyList<RoomVariantCommands.CreateRequest> CreateRoomVariantsRequests { get; set; } = new List<RoomVariantCommands.CreateRequest>();

        ///<summary> Коллекция фотографий </summary>
        public IReadOnlyList<FileObjectDTO> CreatePhotos { get; set; } = new List<FileObjectDTO>();
    }
}