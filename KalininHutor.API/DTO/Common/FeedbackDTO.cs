namespace KalininHutor.API.DTO;

public class FeedbackDTO
{
    public Guid Id { get; set; }
    public string Comment { get; set; }
    public uint Rate { get; set; }
    public Guid? UserId { get; set; }
    public string? PhoneNumber { get; set; }
}