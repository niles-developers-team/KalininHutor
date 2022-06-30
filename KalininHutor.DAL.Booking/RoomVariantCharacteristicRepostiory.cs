using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomVariantCharacteristicRepository : BaseRepository<RoomVariantCharacteristicEntity, RoomVariantCharacteristicSearchOptions>
{
    public RoomVariantCharacteristicRepository(string connectionString, ILogger<RoomVariantCharacteristicRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(RoomVariantCharacteristicEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into RoomVariantCharacteristics (Id, RoomVariantId, RoomCharacteristicId, Price)
            values (
                {entity.Id},
                {entity.RoomVariantId},
                {entity.RoomCharacteristicId},
                {entity.Price}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(Guid id)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from RoomVariantCharacteristics where Id = {id}").ExecuteAsync();
    }

    public override async Task<IEnumerable<RoomVariantCharacteristicEntity>> Get(RoomVariantCharacteristicSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select rvch.Id, rvch.RoomVariantId, rvch.RoomCharacteristicId, rvch.Price
            from RoomVariantCharacteristics rvch
            inner join Characteristics ch on rvch.RoomCharacteristicId = ch.Id
            /**where**/
        ");

        if (options.RoomVariantId.HasValue)
            query.Where($"RoomVariantId = {options.RoomVariantId}");

        if (options.RoomsVariantsIds != null)
            query.Where($"RoomVariantId = any({options.RoomsVariantsIds})");

        return await query.QueryAsync<RoomVariantCharacteristicEntity>();
    }

    public override async Task<RoomVariantCharacteristicEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select Id, RoomVariantId, RoomCharacteristicId, Price
            from RoomVariantCharacteristics
            where Id = {id}
        ").QuerySingleOrDefaultAsync<RoomVariantCharacteristicEntity>();
    }

    public override async Task Update(RoomVariantCharacteristicEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update RoomVariantCharacteristics
            set Price = {entity.Price}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}