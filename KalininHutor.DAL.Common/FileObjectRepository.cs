using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL;

public class FileObjectRepository : BaseRepository<FileObjectEntity, FileObjectSearchOptions>, ICreateBulk<FileObjectEntity>
{
    public FileObjectRepository(string connectionString, ILogger<BaseRepository<FileObjectEntity, FileObjectSearchOptions>> logger) : base(connectionString, logger) { }

    public override async Task Create(FileObjectEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into FileObjects (Id, Name, Extension, CompressedBody, CreatedAt, SortOrder, ParentId)
            values (
                {entity.Id},
                {entity.Name},
                {entity.Extension},
                {entity.CompressedBody},
                {entity.CreatedAt},
                {entity.SortOrder},
                {entity.ParentId}
            );
        ").ExecuteAsync();
    }

    public async Task CreateBulk(IList<FileObjectEntity> entities)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            insert into FileObjects (Id, Name, Extension, CompressedBody, CreatedAt, SortOrder, ParentId)
            values
        ");

        int index = 0;

        foreach (var entity in entities)
        {
            query.AppendLine($@"
                (
                    {entity.Id},
                    {entity.Name},
                    {entity.Extension},
                    {entity.CompressedBody},
                    {entity.CreatedAt},
                    {index},
                    {entity.ParentId}
                )
            ");
            index++;

            if (index < entities.Count)
                query.Append($",");
        }

        await query.ExecuteAsync();
    }

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
        if(!ids.Any()) return;

        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            delete from FileObjects where Id = any({ids});
        ").ExecuteAsync();
    }

    public override async Task<IEnumerable<FileObjectEntity>> Get(FileObjectSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                Id, 
                Name,
                Extension,
                CompressedBody,
                CreatedAt, 
                SortOrder, 
                ParentId
            from FileObjects
            /**where**/
            order by SortOrder
        ");

        if (options.Ids?.Any() ?? false)
            query.Where($"Id = any({options.Ids})");

        if (options.ParentsIds?.Any() ?? false)
            query.Where($"ParentId = any({options.ParentsIds})");

        if (options.ParentId.HasValue)
            query.Where($"ParentId = {options.ParentId}");

        return await query.QueryAsync<FileObjectEntity>();
    }

    public override async Task<FileObjectEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select 
                Id, 
                Name,
                Extension,
                CompressedBody,
                CreatedAt, 
                SortOrder, 
                ParentId
            from FileObjects
            where Id = {id}
        ").QuerySingleOrDefaultAsync<FileObjectEntity>();
    }

    public override async Task Update(FileObjectEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            update FileObjects set 
                SortOrder = {entity.SortOrder}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}