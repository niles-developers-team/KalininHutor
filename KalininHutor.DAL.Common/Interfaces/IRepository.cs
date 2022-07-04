namespace KalininHutor.DAL.Common;

public interface IRepository<TResult, TSearchOptions>
{
    Task Create(TResult entity);

    Task Update(TResult entity);

    Task<IEnumerable<TResult>> Get(TSearchOptions options);

    Task<TResult> Get(Guid id);

    Task Delete(IReadOnlyList<Guid> ids);
}