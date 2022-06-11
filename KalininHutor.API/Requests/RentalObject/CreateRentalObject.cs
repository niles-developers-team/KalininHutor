using MediatR;
using AutoMapper;

using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Requests;

using DomainRentalObject = Domain.Booking.RentalObject;

internal class CreateRentalObjectHandler : IRequestHandler<RentalObject.CreateRequest, Guid>
{
    private readonly RentalObjectRepository _repository;
    private readonly IMapper _mapper;

    public CreateRentalObjectHandler(RentalObjectRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Guid> Handle(RentalObject.CreateRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = new DomainRentalObject(request.Name, request.Description,
                        request.Address, request.CheckinTime, request.CheckoutTime, request.LandlordId);
        await _repository.Create(_mapper.Map<RentalObjectEntity>(rentalObject));

        return rentalObject.Id;
    }
}

public partial class RentalObject
{
    ///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
    public class CreateRequest : IRequest<Guid>
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
}