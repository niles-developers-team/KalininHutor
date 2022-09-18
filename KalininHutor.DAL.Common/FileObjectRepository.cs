using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL;

public class FileObjectRepository : BaseRepository<FileObjectEntity, FileObjectSearchOptions>
{
    public FileObjectRepository(string connectionString, ILogger<BaseRepository<FileObjectEntity, FileObjectSearchOptions>> logger) : base(connectionString, logger) { }

    public override async Task Create(FileObjectEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into FileObjects (Id, UserID, Type, Message, Variant, CreatedAt)
            values (
                {entity.Id},
                {entity.CompressedBody},
                {entity.CreatedAt},
                {entity.Extension},
                {entity.Name}
            )
        ").ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from FileObjects where Id = any({ids})").ExecuteAsync();
    }

    public override async Task<IEnumerable<FileObjectEntity>> Get(FileObjectSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                Id, 
                Body,
                CreatedAt, 
                Extension, 
                Name
            from FileObjects
            /**where**/
            order by CreatedAt desc
        ");

        if (options.Ids.Any())
            query.Where($"Id = any({options.Ids})");

        return await query.QueryAsync<FileObjectEntity>();
    }

    public override async Task<FileObjectEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select 
                Id, 
                Body,
                CreatedAt, 
                Extension, 
                Name
            from FileObjects
            where Id = {id}
        ").QuerySingleOrDefaultAsync<FileObjectEntity>();
    }

    public override async Task Update(FileObjectEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update FileObjects
            set Name = {entity.Name}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}