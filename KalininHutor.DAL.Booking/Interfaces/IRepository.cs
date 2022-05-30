namespace KalininHutor.DAL.Booking;

public interface IRepository<TResult, TSearchOptions>
{
    Task<Guid> Create(TResult entity);

    Task Update(TResult entity);

    Task<List<RentalObjectEntity>> Get(TSearchOptions options);

    Task Delete(Guid id);
}