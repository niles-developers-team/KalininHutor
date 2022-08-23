using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class BookingRoomVariantRepository : BaseRepository<BookingRoomVariantEntity, BookingRoomVariantSearchOptions>
{
    public BookingRoomVariantRepository(string connectionString, ILogger<BookingRoomVariantRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(BookingRoomVariantEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into BookingRoomVariants (Id, RoomVariantId, BookingId, Amount, BedType, RoomsCount)
            values (
                {entity.Id},
                {entity.RoomVariantId},
                {entity.BookingId},
                {entity.Amount},
                {entity.BedType},
                {entity.RoomsCount}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from BookingRoomVariants where Id = any({ids})").ExecuteAsync();
    }

    public override async Task<IEnumerable<BookingRoomVariantEntity>> Get(BookingRoomVariantSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select Id, RoomVariantId, BookingId, Amount, BedType, RoomsCount
            from BookingRoomVariants
            /*where*/
        ");

        if (options.BookingId.HasValue)
            query.Where($"BookingId = {options.BookingId}");

        if(options.BookingsIds != null && options.BookingsIds.Any())
            query.Where($"BookingId = any({options.BookingsIds})");

        return await query.QueryAsync<BookingRoomVariantEntity>();
    }

    public override async Task<BookingRoomVariantEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select Id, RoomVariantId, BookingId, Amount, BedType, RoomsCount
            from BookingRoomVariants
            where Id = {id}
        ").QuerySingleOrDefaultAsync<BookingRoomVariantEntity>();
    }

    public override Task Update(BookingRoomVariantEntity entity)
    {
        throw new NotSupportedException("Изменение выбранного варианта номера не поддерживается.");
    }
}