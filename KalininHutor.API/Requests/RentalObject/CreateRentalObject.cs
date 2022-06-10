using MediatR;
using AutoMapper;

using KalininHutor.Domain.Booking;
using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Requests;

internal class CreateRentalObjectHandler : IRequestHandler<CreateRentalObjectRequest, Guid>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public CreateRentalObjectHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(CreateRentalObjectRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = new RentalObject(request.Name, request.Description,
                        request.Address, request.CheckinTime, request.CheckoutTime, request.LandlordId);
        await _repository.Create(_mapper.Map<RentalObjectEntity>(rentalObject));

        return rentalObject.Id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateRentalObjectRequest : IRequest<Guid>
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
}