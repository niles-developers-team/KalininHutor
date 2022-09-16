using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL;

public class NotificationRepository : BaseRepository<NotificationEntity, NotificationSearchOptions>
{
    public NotificationRepository(string connectionString, ILogger<BaseRepository<NotificationEntity, NotificationSearchOptions>> logger) : base(connectionString, logger) { }

    public override async Task Create(NotificationEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into Notifications (Id, UserID, Type, Message, Variant, CreatedAt)
            values (
                {entity.Id},
                {entity.UserId},
                {entity.Type},
                {entity.Message},
                {entity.Variant.ToString()},
                {entity.CreatedAt}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from Notifications where Id = any({ids})").ExecuteAsync();
    }

    public override async Task<IEnumerable<NotificationEntity>> Get(NotificationSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                Id, 
                UserId,
                Type, 
                Message, 
                Variant,
                CreatedAt,
                Read
            from Notifications
            /**where**/
            order by CreatedAt desc
        ");

        if (options.UserId.HasValue)
            query.Where($"UserId = {options.UserId}");

        if (options.Status.HasValue)
            switch (options.Status)
            {
                case NotificationStatus.OnlyRead: query.Where($"Read = 1"); break;
                case NotificationStatus.OnlyUnread: query.Where($"Read = 0"); break;
            }

        if (options.Type.HasValue)
            query.Where($"Type = {options.Type}");

        return await query.QueryAsync<NotificationEntity>();
    }

    public override async Task<NotificationEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select 
                Id, 
                UserId,
                Type, 
                Message, 
                Variant,
                CreatedAt,
                Read
            from Notifications
            where Id = {id}
        ").ExecuteScalarAsync<NotificationEntity>();
    }

    public override async Task Update(NotificationEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update Notifications
            set Read = {entity.Read}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}