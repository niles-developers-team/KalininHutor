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
            insert into Bookings (
                Id, 
                TenantId, 
                TenantName, 
                TenantLastName, 
                TenantEmail, 
                TenantPhone, 
                RentalObjectId, 
                AdultCount, 
                ChildCount, 
                CheckinDate, 
                CheckoutDate, 
                Total,
                Status,
                CreatedAt
            )
            values (
                {entity.Id},
                {entity.TenantId},
                {entity.TenantName},
                {entity.TenantLastname},
                {entity.TenantEmail},
                {entity.TenantPhone},
                {entity.RentalObjectId},
                {entity.AdultCount},
                {entity.ChildCount},
                {entity.CheckinDateTime},
                {entity.CheckoutDateTime},
                {entity.Total},
                {entity.Status},
                {entity.CreatedAtDateTime}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from Bookings where Id = any({ids})").ExecuteAsync();
    }

    public override async Task<IEnumerable<BookingEntity>> Get(BookingSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                b.Id, 
                b.TenantId,
                b.TenantName,
                b.TenantLastname,
                b.TenantEmail,
                b.TenantPhone,
                b.RentalObjectId,
                b.AdultCount,
                b.ChildCount,
                b.CheckinDate as CheckinDateTime,
                b.CheckoutDate as CheckoutDateTime,
                b.Total,
                b.Status,
                b.Number,
                b.CreatedAt as CreatedAtDateTime
            from Bookings b
            inner join RentalObjects ro on b.RentalObjectId = ro.Id
            /**where**/
            order by Number desc, CreatedAt desc
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

        if (options.LandlordId.HasValue)
            query.Where($"ro.LandlordId = {options.LandlordId}");

        if (options.OnlyNotApproved)
            query.Where($"b.Status = 1");

        return await query.QueryAsync<BookingEntity>();
    }

    public async override Task<BookingEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select 
                b.Id, 
                b.TenantId,
                b.TenantName,
                b.TenantLastname,
                b.TenantEmail,
                b.TenantPhone,
                b.RentalObjectId,
                b.AdultCount,
                b.ChildCount,
                b.CheckinDate as CheckinDateTime,
                b.CheckoutDate as CheckoutDateTime,
                b.Total,
                b.Status,
                b.Number,
                b.CreatedAt as CreatedAtDateTime
            from Bookings b
            inner join RentalObjects ro on b.RentalObjectId = ro.Id
            where b.Id = {id}
        ").QuerySingleOrDefaultAsync<BookingEntity>();
    }

    public override async Task Update(BookingEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update Bookings
            set 
                AdultCount = {entity.AdultCount},
                ChildCount = {entity.ChildCount},
                CheckinDate = {entity.CheckinDateTime},
                CheckoutDate = {entity.CheckoutDateTime},
                Total = {entity.Total},
                Status = {entity.Status}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}