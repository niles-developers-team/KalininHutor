using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomVariantCharacteristicRepository : IRepository<RoomVariantCharacteristicEntity, RoomVariantCharacteristicSearchOptions>
{
    private readonly string _connectionString;
    private readonly ILogger<RoomVariantCharacteristicRepository> _logger;

    public RoomVariantCharacteristicRepository(string connectionString, ILogger<RoomVariantCharacteristicRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task Create(RoomVariantCharacteristicEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<RoomVariantCharacteristicEntity>> Get(RoomVariantCharacteristicSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task<RoomVariantCharacteristicEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task Update(RoomVariantCharacteristicEntity entity)
    {
        throw new NotImplementedException();
    }
}