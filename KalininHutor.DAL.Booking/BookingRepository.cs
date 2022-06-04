using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class BookingRepository : IRepository<BookingEntity, BookingSearchOptions>
{
    private readonly string _connectionString;
    private readonly ILogger<BookingRepository> _logger;

    public BookingRepository(string connectionString, ILogger<BookingRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task Create(BookingEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<BookingEntity>> Get(BookingSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task Update(BookingEntity entity)
    {
        throw new NotImplementedException();
    }
}