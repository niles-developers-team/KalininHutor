using System;

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
                        request.Address, request.CheckinTime.HasValue ? TimeOnly.FromDateTime(request.CheckinTime.Value) : null,
                        request.CheckoutTime.HasValue ? TimeOnly.FromDateTime(request.CheckoutTime.Value) : null, request.OwnerId);
        await _repository.Create(_mapper.Map<RentalObjectEntity>(rentalObject));

        return rentalObject.Id;
    }
}

///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
public class CreateRentalObjectRequest : IRequest<Guid>
{
    ///<summary> Название объекта аренды </summary>
    public string? Name { get; set; }
    ///<summary> Описание объекта аренды </summary>
    public string? Description { get; set; }
    ///<summary> Адрес объекта аренды </summary>
    public string? Address { get; set; }

    ///<summary> Идентификатор владельца </summary>
    public Guid OwnerId { get; set; }

    ///<summary> Время заезда </summary>
    public DateTime? CheckinTime { get; set; }
    ///<summary> Время отъезда </summary>
    public DateTime? CheckoutTime { get; set; }
}