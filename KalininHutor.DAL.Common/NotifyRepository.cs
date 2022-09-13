using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL;

public class NotifyRepository : BaseRepository<NotifyEntity, NotifySearchOptions>
{
    public NotifyRepository(string connectionString, ILogger<BaseRepository<NotifyEntity, NotifySearchOptions>> logger) : base(connectionString, logger) { }

    public override async Task Create(NotifyEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into Notifies (Id, UserID, Type, Message, Variant, CreatedAt)
            values (
                {entity.Id},
                {entity.UserId},
                {entity.Type},
                {entity.Message},
                {entity.Variant},
                {entity.CreatedAt}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from Notifies where Id = any({ids})").ExecuteAsync();        
    }

    public override async Task<IEnumerable<NotifyEntity>> Get(NotifySearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                Id, 
                UserId
                Type, 
                Message, 
                Variant,
                CreatedAt,
                Read
            from Notifies
            /*where*/
        ");

        if (options.UserId.HasValue)
            query.Where($@"UserId = {options.UserId}");

        return await query.QueryAsync<NotifyEntity>();
    }

    public override Task<NotifyEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public override async Task Update(NotifyEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update Notifies
            set Read = {entity.Read}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}