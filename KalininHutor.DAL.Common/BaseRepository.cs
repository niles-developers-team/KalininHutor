using System.Data;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace KalininHutor.DAL.Common;

public abstract class BaseRepository<T, TSearchOptions> : IRepository<T, TSearchOptions>
{
    protected readonly string _connectionString;
    protected readonly ILogger<BaseRepository<T, TSearchOptions>> _logger;

    public BaseRepository(string connectionString, ILogger<BaseRepository<T, TSearchOptions>> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public abstract Task Create(T entity);

    public abstract Task Delete(IReadOnlyList<Guid> ids);

    public abstract Task<IEnumerable<T>> Get(TSearchOptions options);

    public abstract Task<T> Get(Guid id);

    public abstract Task Update(T entity);

    protected IDbConnection GetConnection() => new NpgsqlConnection(_connectionString);
}