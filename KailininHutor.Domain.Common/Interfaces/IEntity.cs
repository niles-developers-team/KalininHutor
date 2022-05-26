namespace KalininHutor.Domain
{
    public interface IEntity<T>
    {
        T Id { get; }
    }
}