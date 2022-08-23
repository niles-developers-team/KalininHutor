using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomVariantRepository : BaseRepository<RoomVariantEntity, RoomVariantSearchOptions>
{
    public RoomVariantRepository(string connectionString, ILogger<RoomVariantRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(RoomVariantEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into RoomVariants (
                Id,
                RentalObjectId,
                Name,
                Description,
                Price,
                Width,
                Length,
                MaxPersonsCount,
                FreeCancellationPeriod,
                PaymentOption,
                Count,
                FreeCount
            )
            values (
                {entity.Id},
                {entity.RentalObjectId},
                {entity.Name},
                {entity.Description},
                {entity.Price},
                {entity.Width},
                {entity.Length},
                {entity.MaxPersonsCount},
                {entity.FreeCancellationPeriod},
                {entity.PaymentOption},
                {entity.Count},
                {entity.FreeCount}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"delete from RoomVariants where Id = any({ids})");

        await query.ExecuteAsync();
    }

    public override async Task<IEnumerable<RoomVariantEntity>> Get(RoomVariantSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                rv.Id,
                rv.RentalObjectId,
                rv.Name,
                rv.Description,
                rv.Price,
                rv.Width,
                rv.Length,
                rv.MaxPersonsCount,
                rv.FreeCancellationPeriod,
                rv.PaymentOption,
                rv.Count,
                rv.FreeCount
            from RoomVariants rv
            /**where**/
            order by Price desc, Name asc
        ");

        if (options.RentalObjectId.HasValue)
            query.Where($"RentalObjectId = {options.RentalObjectId}");

        if (options.RentalObjectsIds != null && options.RentalObjectsIds.Any())
            query.Where($"RentalObjectId = any ({options.RentalObjectsIds})");

        return await query.QueryAsync<RoomVariantEntity>();
    }

    public override async Task<RoomVariantEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select 
                rv.Id,
                rv.RentalObjectId,
                rv.Name,
                rv.Description,
                rv.Price,
                rv.Width,
                rv.Length,
                rv.MaxPersonsCount,
                rv.FreeCancellationPeriod,
                rv.PaymentOption,
                rv.Count,
                rv.FreeCount
            from RoomVariants rv
            where Id = {id}
        ").QuerySingleOrDefaultAsync<RoomVariantEntity>();
    }

    public override async Task Update(RoomVariantEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update RoomVariants
            set Name = {entity.Name},
                Description = {entity.Description},
                Price = {entity.Price},
                Width = {entity.Width},
                Length = {entity.Length},
                MaxPersonsCount = {entity.MaxPersonsCount},
                FreeCancellationPeriod = {entity.FreeCancellationPeriod},
                PaymentOption = {entity.PaymentOption},
                Count = {entity.Count},
                FreeCount = {entity.FreeCount}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}
