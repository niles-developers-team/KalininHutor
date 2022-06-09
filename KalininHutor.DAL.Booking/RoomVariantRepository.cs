using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomVariantRepository : IRepository<RoomVariantEntity, RoomVariantSearchOptions>
{
    private readonly string _connectionString;
    private readonly ILogger<RoomVariantRepository> _logger;

    public RoomVariantRepository(string connectionString, ILogger<RoomVariantRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task Create(RoomVariantEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<RoomVariantEntity>> Get(RoomVariantSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task<RoomVariantEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task Update(RoomVariantEntity entity)
    {
        throw new NotImplementedException();
    }
}
