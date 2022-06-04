using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class BookingRoomVariantRepository : IRepository<BookingRoomVariantBedTypeEntity, BookingRoomVariantSearchOptions>
{
    private readonly ILogger<BookingRoomVariantRepository> _logger;
    private readonly string _connectionString;

    public BookingRoomVariantRepository(string connectionString, ILogger<BookingRoomVariantRepository> logger)
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

    public Task<IEnumerable<BookingRoomVariantBedTypeEntity>> Get(BookingRoomVariantSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task Update(BookingRoomVariantBedTypeEntity entity)
    {
        throw new NotImplementedException();
    }
}