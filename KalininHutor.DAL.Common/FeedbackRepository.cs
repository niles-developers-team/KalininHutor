using DapperQueryBuilder;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Common;

public class FeedbackRepository : BaseRepository<FeedbackEntity, FeedbackEntitySearchOptions>
{
    public FeedbackRepository(string connectionString, ILogger<BaseRepository<FeedbackEntity, FeedbackEntitySearchOptions>> logger) : base(connectionString, logger) { }

    public override async Task Create(FeedbackEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into Feedback (Id, FeedbackObjectId, Comment, Rate, CreatedAt)
            values (
                {entity.Id},
                {entity.FeedbackObjectId},
                {entity.Comment},
                {(int)entity.Rate},
                {entity.CreatedAtDateTime}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from Feedback where Id = any({ids})").ExecuteAsync();
    }

    public override async Task<IEnumerable<FeedbackEntity>> Get(FeedbackEntitySearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select Id, FeedbackObjectId, Comment, Rate, CreatedAt as CreatedAtDateTime
            from Feedback
            /**where**/
            order by CreatedAt desc
            {(options.Take.HasValue ? $"limit {options.Take} offset {options.Take - options.Take}" : string.Empty):raw}
        ");

        if (options.FeedbackObjectsIds.Any())
            query.Where($"FeedbackObjectId = any({options.FeedbackObjectsIds.ToList()})");

        return await query.QueryAsync<FeedbackEntity>();
    }

    public override Task<FeedbackEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public override Task Update(FeedbackEntity entity)
    {
        throw new NotImplementedException();
    }
}