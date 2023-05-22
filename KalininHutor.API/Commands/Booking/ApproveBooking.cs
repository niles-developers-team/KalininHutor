using AutoMapper;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Commands;

internal class ApproveBookingHandler : IRequestHandler<BookingCommands.ApproveRequest, Unit>
{
    private readonly BookingRepository _repository;
    private readonly IMapper _mapper;
    private readonly ISender _sender;
    public ApproveBookingHandler(BookingRepository repository, IMapper mapper,
        ISender sender)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    public async Task<Unit> Handle(BookingCommands.ApproveRequest request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<Booking>(await _repository.Get(request.Id));
        entity.SetStatus(BookingStatuses.Approved);
        await _repository.Update(_mapper.Map<BookingEntity>(entity));
        if (entity.TenantId.HasValue)
            await _sender.Send(new NotificationCommands.Create(NotifyVariant.Info, $"Бронь #{entity.Number} подтверждена", NotifyType.BookingApproved, entity.TenantId.Value));
            
        return Unit.Value;
    }
}

///<summary> Запросы и очереди бронирования </summary>
public partial class BookingCommands
{
    ///<summary> Запрос обновления объекта аренды </summary>
    public class ApproveRequest : IRequest<Unit>
    {
        ///<summary> Идентификатор объекта аренды </summary>
        ///<remarks> Не изменяется, нужен только для поиска </remarks>
        public Guid Id { get; set; }
    }
}