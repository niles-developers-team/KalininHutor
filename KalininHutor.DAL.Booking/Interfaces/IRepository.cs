namespace KalininHutor.DAL.Booking;

public interface IRepository<TResult, TSearchOptions>
{
    Task Create(TResult entity);

    Task Update(TResult entity);

    Task<IEnumerable<TResult>> Get(TSearchOptions options);

    Task Delete(Guid id);
}