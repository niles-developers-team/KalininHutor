namespace KalininHutor.DAL.Common;

public class FeedbackEntity : IEntity<Guid>
{
    private DateTime _createdAt;

    public Guid Id { get; protected set; }
    public Guid FeedbackObjectId { get; protected set; }
    public uint Rate { get; protected set; }
    public string? Comment { get; protected set; }
    public Guid? UserId { get; protected set; }
    public string? PhoneNumber { get; protected set; }
    public DateOnly CreatedAt { get => DateOnly.FromDateTime(_createdAt); protected set => _createdAt = value.ToDateTime(new TimeOnly()); }
    internal DateTime CreatedAtDateTime { get => _createdAt; private set => _createdAt = value; }
}

public class FeedbackEntitySearchOptions
{
    public IEnumerable<Guid> FeedbackObjectsIds { get; set; }
    public int? Take { get; set; }
}