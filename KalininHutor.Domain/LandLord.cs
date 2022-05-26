namespace KalininHutor.Domain;

public class LandLord : IEntity<Guid>
{
    public Guid Id { get; protected set; }

    protected LandLord() { }
}