namespace KalininHutor.DAL.Booking;

public interface IRepository<TResult, TSearchOptions>
{
    Task Create(TResult entity);

    Task Update(TResult entity);

    Task<IEnumerable<RentalObjectEntity>> Get(TSearchOptions options);

    Task Delete(Guid id);
}