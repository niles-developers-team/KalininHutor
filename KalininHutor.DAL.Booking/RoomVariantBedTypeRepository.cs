using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomVariantBedTypeRepository : BaseRepository<RoomVariantBedTypeEntity, RoomVariantBedTypeSearchOptions>, ICreateBulk<RoomVariantBedTypeEntity>
{
    public RoomVariantBedTypeRepository(string connectionString, ILogger<RoomVariantBedTypeRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(RoomVariantBedTypeEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into RoomVariantBedTypes (Id, RoomVariantId, BedType, Width, Length)
            values (
                {entity.Id},
                {entity.RoomVariantId},
                {entity.BedType},
                {entity.Width},
                {entity.Length}
            )
        ").ExecuteAsync();
    }

    public async Task CreateBulk(IList<RoomVariantBedTypeEntity> entities)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            insert into RoomVariantBedTypes (Id, RoomVariantId, BedType, Width, Length)
            values
        ");

        int index = 0;

        foreach (var entity in entities)
        {
            index++;
            query.AppendLine($@"
                (
                {entity.Id},
                {entity.RoomVariantId},
                {entity.BedType},
                {entity.Width},
                {entity.Length}
                )
            ");

            if (index < entities.Count)
                query.Append($",");
        }

        await query.ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from RoomVariantBedTypes where Id = any({ids})").ExecuteAsync();
    }

    public override async Task<IEnumerable<RoomVariantBedTypeEntity>> Get(RoomVariantBedTypeSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
                select Id, RoomVariantId, BedType, Width, Length
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
            select Id, RoomVariantId, BedType, Width, Length
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
                Length = {entity.Length}
            where Id = {entity.Id}
        ").ExecuteAsync();

    }
}