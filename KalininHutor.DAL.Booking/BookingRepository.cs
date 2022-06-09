using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class BookingRepository : BaseRepository<BookingEntity, BookingSearchOptions>
{
    public BookingRepository(string connectionString, ILogger<BookingRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(BookingEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into Bookings (Id, TenantId, RentalObjectId, AdultCount, ChildCount, CheckinDate, CheckoutDate, Total)
            values (
                {entity.Id},
                {entity.TenantId},
                {entity.RentalObjectId},
                {entity.AdultCount},
                {entity.ChildCount},
                {entity.CheckinDateTime},
                {entity.CheckoutDateTime},
                {entity.Total}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(Guid id)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from Bookings where Id = {id}").ExecuteAsync();
    }

    public override async Task<IEnumerable<BookingEntity>> Get(BookingSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                b.Id, 
                b.TenantId,
                b.RentalObjectId,
                b.AdultCount,
                b.ChildCount,
                b.CheckinDate,
                b.CheckoutDate,
                b.Total
            from Bookings b
            inner join RentalObjects ro on b.RentalObjectId = ro.Id
            /*where*/
        ");

        if (!string.IsNullOrEmpty(options.SearchText))
            query.Where($"ro.Name like '%{options.SearchText}%'");

        if (options.TenantId.HasValue)
            query.Where($"b.TenantId = {options.TenantId}");

        if (options.CheckinDate.HasValue)
            query.Where($"b.CheckinDate >= {options.CheckinDateTime}");

        if (options.CheckoutDate.HasValue)
            query.Where($"b.CheckoutDate <= {options.CheckoutDateTime}");

        if (options.RentalObjectId.HasValue)
            query.Where($"b.RentalObjectId = {options.RentalObjectId}");

        return await query.QueryAsync<BookingEntity>();
    }

    public override Task<BookingEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return connection.QueryBuilder($@"
            select 
                b.Id, 
                b.TenantId,
                b.RentalObjectId,
                b.AdultCount,
                b.ChildCount,
                b.CheckinDate,
                b.CheckoutDate,
                b.Total
            from Bookings b
            inner join RentalObjects ro on b.RentalObjectId = ro.Id
            where Id = {id}
        ").QuerySingleOrDefaultAsync<BookingEntity>();
    }

    public override async Task Update(BookingEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update Bookings
            set 
                TenantId = {entity.TenantId},
                RentalObjectId = {entity.RentalObjectId},
                AdultCount = {entity.AdultCount},
                ChildCount = {entity.ChildCount},
                CheckinDate = {entity.CheckinDateTime},
                CheckoutDate = {entity.CheckoutDateTime},
                Total = {entity.Total}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}