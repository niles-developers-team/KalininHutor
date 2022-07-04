using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class BookingRoomVariantBedTypeRepository : BaseRepository<BookingRoomVariantBedTypeEntity, BookingRoomVariantBedTypeSearchOptions>
{
    public BookingRoomVariantBedTypeRepository(string connectionString, ILogger<BookingRoomVariantBedTypeRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(BookingRoomVariantBedTypeEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into BookingRoomVariantBedTypes (Id, BookingRoomVariantId, BedTypeId, Count)
            values (
                {entity.Id},
                {entity.BookingRoomVariantId},
                {entity.BedTypeId},
                {entity.Count}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from BookingRoomVariantBedTypes where Id = any({ids})").ExecuteAsync();
    }

    public override async Task<IEnumerable<BookingRoomVariantBedTypeEntity>> Get(BookingRoomVariantBedTypeSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select Id, BookingRoomVariantId, BedTypeId, Count
            from BookingRoomVariantBedTypes b
            /*where*/
        ");

        if (options.BookingRoomVariantId.HasValue)
            query.Where($"BookingRoomVariantId = {options.BookingRoomVariantId}");

        return await query.QueryAsync<BookingRoomVariantBedTypeEntity>();
    }

    public override async Task<BookingRoomVariantBedTypeEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select Id, BookingRoomVariantId, BedTypeId, Count
            from BookingRoomVariantBedTypes b
            where Id = {id}
        ").QuerySingleOrDefaultAsync<BookingRoomVariantBedTypeEntity>();
    }

    public override async Task Update(BookingRoomVariantBedTypeEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update BookingRoomVariantBedTypes
            set Count = {entity.Count}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}