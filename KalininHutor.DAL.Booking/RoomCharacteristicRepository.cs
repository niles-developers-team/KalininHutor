using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomCharacteristicRepository : IRepository<RoomCharacteristicEntity, RoomCharacteristicSearchOptions>
{
    private readonly ILogger<RoomCharacteristicRepository> _logger;
    private readonly string _connectionString;

    public RoomCharacteristicRepository(string connectionString, ILogger<RoomCharacteristicRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    
    public Task Create(RoomCharacteristicEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<RoomCharacteristicEntity>> Get(RoomCharacteristicSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task<RoomCharacteristicEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task Update(RoomCharacteristicEntity entity)
    {
        throw new NotImplementedException();
    }
}