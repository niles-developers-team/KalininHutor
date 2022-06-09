using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Identity;

public class UserRepository : IRepository<UserEntity, UserSearchOptions>
{
    private readonly ILogger<UserRepository> _logger;
    private readonly string _connectionString;
    
    public UserRepository(string connectionString, ILogger<UserRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task Create(UserEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<UserEntity>> Get(UserSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task<UserEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<UserEntity> Get(string phoneNumber)
    {
        throw new NotImplementedException();
    }

    public Task Update(UserEntity entity)
    {
        throw new NotImplementedException();
    }
}
