using MediatR;
using KalininHutor.DAL.Booking;
using KalininHutor.DAL.Common;
using AutoMapper;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Commands;

internal class CreateFeedbackHandler : IRequestHandler<RentalObjectCommands.SendFeedbackRequest>
{
    private readonly RentalObjectRepository _rentalObjectRepository;
    private readonly FeedbackRepository _feedbackRepository;
    private readonly IMapper _mapper;

    public CreateFeedbackHandler(RentalObjectRepository rentalObjectRepository, FeedbackRepository feedbackRepository, IMapper mapper)
    {
        _rentalObjectRepository = rentalObjectRepository ?? throw new ArgumentNullException(nameof(rentalObjectRepository));
        _feedbackRepository = feedbackRepository ?? throw new ArgumentNullException(nameof(feedbackRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Unit> Handle(RentalObjectCommands.SendFeedbackRequest request, CancellationToken cancellationToken)
    {
        var rentalObject = _mapper.Map<RentalObject>(await _rentalObjectRepository.Get(request.RentalObjectId));

        var feedback = rentalObject.CreateFeedback(request.Comment, request.Rate, request.UserId, request.PhoneNumber);

        await _feedbackRepository.Create(_mapper.Map<FeedbackEntity>(feedback));

        return Unit.Value;
    }
}

///<summary> Запросы и очереди объектов аренды </summary>
public partial class RentalObjectCommands
{
    ///<summary> Создает объект аренды, результатом выполнения является GUID </summary>
    public class SendFeedbackRequest : IRequest
    {
        public Guid RentalObjectId { get; set; }
        public string? Comment { get; set; }
        public uint Rate { get; set; }
        public Guid? UserId { get; set; }
        public string? PhoneNumber { get; set; }
    }
}