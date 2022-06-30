using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Booking;

public class RoomCharacteristicRepository : BaseRepository<RoomCharacteristicEntity, RoomCharacteristicSearchOptions>
{
    public RoomCharacteristicRepository(string connectionString, ILogger<RoomCharacteristicRepository> logger) : base(connectionString, logger) { }

    public override async Task Create(RoomCharacteristicEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into RoomCharacteristics (Id, Name, Description, Type)
            values (
                {entity.Id},
                {entity.Name},
                {entity.Description},
                {entity.Type}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(Guid id)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from RoomCharacteristics where Id = {id}").ExecuteAsync();
    }

    public override async Task<IEnumerable<RoomCharacteristicEntity>> Get(RoomCharacteristicSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select Id, Name, Description, Type
            from RoomCharacteristics
            /**where**/
            order by Type, Name
            {(options.Take.HasValue ? $"limit {options.Take}" : string.Empty):raw}
        ");

        if (!string.IsNullOrEmpty(options.SearchText))
            query.Where($"Name like concat('%',{options.SearchText},'%') or Description like concat('%',{options.SearchText},'%')");

        if(options.Type.HasValue)
            query.Where($"Type = {options.Type}");

        return await query.QueryAsync<RoomCharacteristicEntity>();
    }

    public override async Task<RoomCharacteristicEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select Id, Name, Description, Type
            from RoomCharacteristics
            where Id = {id}
        ").QuerySingleOrDefaultAsync<RoomCharacteristicEntity>();
    }

    public override async Task Update(RoomCharacteristicEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update RoomCharacteristics
            set Name = {entity.Name},
                Description = {entity.Description},
                Type = {entity.Type}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}