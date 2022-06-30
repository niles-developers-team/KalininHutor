using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomVariantBedTypeRepository : BaseRepository<RoomVariantBedTypeEntity, RoomVariantBedTypeSearchOptions>
{
    public RoomVariantBedTypeRepository(string connectionString, ILogger<RoomVariantBedTypeRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(RoomVariantBedTypeEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into RoomVariantBedTypes (Id, RoomVariantId, BedType, Width, Length, MaxInRoom)
            values (
                {entity.Id},
                {entity.RoomVariantId},
                {entity.BedType},
                {entity.Width},
                {entity.Length},
                {entity.MaxInRoom}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(Guid id)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from RoomVariantBedTypes where Id = {id}").ExecuteAsync();
    }

    public override async Task<IEnumerable<RoomVariantBedTypeEntity>> Get(RoomVariantBedTypeSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
                select Id, RoomVariantId, BedType, Width, Length, MaxInRoom
                from RoomVariantBedTypes
                /**where**/
            ");

        if (options.RoomVariantId.HasValue)
            query.Where($"RoomVariantId = {options.RoomVariantId}");

        if (options.RoomsVariantsIds != null)
            query.Where($"RoomVariantId = any({options.RoomsVariantsIds})");

        return await query.QueryAsync<RoomVariantBedTypeEntity>();
    }

    public override async Task<RoomVariantBedTypeEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select Id, RoomVariantId, BedType, Width, Length, MaxInRoom
            from RoomVariantBedTypes
            where Id = {id}
        ").QuerySingleOrDefaultAsync<RoomVariantBedTypeEntity>();
    }

    public override async Task Update(RoomVariantBedTypeEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update RoomVariantBedTypes
            set Width = {entity.Width},
                Length = {entity.Length},
                MaxInRoom = {entity.MaxInRoom}
            where Id = {entity.Id}
        ").ExecuteAsync();

    }
}