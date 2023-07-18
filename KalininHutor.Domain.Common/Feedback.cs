namespace KalininHutor.Domain;

public class Feedback : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public Guid FeedbackObjectId { get; protected set; }
    public uint Rate { get; protected set; }
    public string? Comment { get; protected set; }
    public DateOnly CreatedAt { get; protected set; }

    public Guid? UserId { get; protected set; }
    public string? PhoneNumber { get; protected set; }

    protected Feedback() { }

    public Feedback(Guid feedbackObjectId, uint rate, string? comment, Guid? userId, string? phoneNumber)
    {
        Id = Guid.NewGuid();
        FeedbackObjectId = feedbackObjectId;
        Rate = rate;
        Comment = comment;
        CreatedAt = DateOnly.FromDateTime(DateTime.Now);
        UserId = userId;
        PhoneNumber = phoneNumber;
    }
}