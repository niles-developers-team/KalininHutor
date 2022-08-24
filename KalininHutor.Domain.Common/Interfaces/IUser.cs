namespace KalininHutor.Domain;

public interface IUser : IEntity<Guid>
{
    string PhoneNumber { get; }
    string Name { get; }
    string Lastname { get; }
    string Email { get; }
}