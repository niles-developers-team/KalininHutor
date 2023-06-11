using MediatR;
using AutoMapper;
using KalininHutor.API.DTO;
using System.Text.Json;

namespace KalininHutor.API.Commands;

internal class SaveRentalObjectDraftHandler : IRequestHandler<RentalObjectCommands.SaveDraft>
{
    private readonly HttpContext _context;
    private readonly IMapper _mapper;

    public SaveRentalObjectDraftHandler(IHttpContextAccessor httpContextAccessor, IMapper mapper)
    {
        if(httpContextAccessor == null) throw new ArgumentNullException(nameof(httpContextAccessor));
        _context = httpContextAccessor.HttpContext;
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RentalObjectCommands.SaveDraft request, CancellationToken cancellationToken)
    {
        _context.Session.SetString("rental-object-draft", JsonSerializer.Serialize(request));

        return Unit.Value;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
{
    ///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
    public class SaveDraft : IRequest
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