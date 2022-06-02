using MediatR;
using AutoMapper;

using KalininHutor.Domain.Booking;
using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Booking.Requests;

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
                        request.Address, request.CheckinTime, request.CheckoutTime, request.OwnerId);

        var id = await _repository.Create(_mapper.Map<RentalObjectEntity>(rentalObject));

        return id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateRentalObjectRequest : IRequest<Guid>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }

    public Guid OwnerId { get; set; }

    public TimeOnly CheckinTime { get; set; }
    public TimeOnly CheckoutTime { get; set; }
}