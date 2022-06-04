using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class BookingRoomVariantBedTypeRepository : IRepository<BookingRoomVariantBedTypeEntity, BookingRoomVariantBedTypeSearchOptions>
{
    private readonly ILogger<BookingRoomVariantBedTypeRepository> _logger;
    private readonly string _connectionString;

    public BookingRoomVariantBedTypeRepository(string connectionString, ILogger<BookingRoomVariantBedTypeRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task Create(BookingRoomVariantBedTypeEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<BookingRoomVariantBedTypeEntity>> Get(BookingRoomVariantBedTypeSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task Update(BookingRoomVariantBedTypeEntity entity)
    {
        throw new NotImplementedException();
    }
}