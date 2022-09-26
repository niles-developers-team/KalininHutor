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

    public override async Task Delete(IReadOnlyList<Guid> ids)
    {
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
                Name = {entity.Name},
                Extension = {entity.Extension},
                CompressedBody = {entity.CompressedBody},
                SortOrder = {entity.SortOrder}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }
}