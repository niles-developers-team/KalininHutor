namespace KalininHutor.DAL;

public interface IEntity<T>
{
    Guid Id { get; }
}