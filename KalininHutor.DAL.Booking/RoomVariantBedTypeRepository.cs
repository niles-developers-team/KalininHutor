using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomVariantBedTypeRepository : IRepository<RoomVariantBedTypeEntity, RoomVariantBedTypeSearchOptions>
{
    private readonly string _connectionString;
    private readonly ILogger<RoomVariantBedTypeRepository> _logger;

    public RoomVariantBedTypeRepository(string connectionString, ILogger<RoomVariantBedTypeRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task Create(RoomVariantBedTypeEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<RoomVariantBedTypeEntity>> Get(RoomVariantBedTypeSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task Update(RoomVariantBedTypeEntity entity)
    {
        throw new NotImplementedException();
    }
}