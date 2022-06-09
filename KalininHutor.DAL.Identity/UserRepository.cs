using System.Data;
using DapperQueryBuilder;
using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace KalininHutor.DAL.Identity;

public class UserRepository : IRepository<UserEntity, UserSearchOptions>
{
    private readonly ILogger<UserRepository> _logger;
    private readonly string _connectionString;

    private IDbConnection GetConnection() => new NpgsqlConnection(_connectionString);

    public UserRepository(string connectionString, ILogger<UserRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Create(UserEntity entity)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"
            insert into Users (Id, PhoneNumber, Password, Name, Lastname, Email, BirthDay)
            values (
                {entity.Id},
                {entity.PhoneNumber},
                {entity.Password},
                {entity.Name},
                {entity.Lastname},
                {entity.Email},
                {entity.BirthDayDateTime}
            )
        ").ExecuteAsync();
    }

    public async Task Delete(Guid id)
    {
        using var connection = GetConnection();

        await connection.QueryBuilder($@"delete from Users where Id = {id}").ExecuteAsync();        
    }

    public async Task<IEnumerable<UserEntity>> Get(UserSearchOptions options)
    {
        using var connection = GetConnection();

        var query = connection.QueryBuilder($@"
            select 
                Id, 
                PhoneNumber, 
                Name, 
                Lastname, 
                Email, 
                BirthDay as BirthDayDateTime 
            from Users
            /*where*/
        ");

        if(!string.IsNullOrEmpty(options.SearchText))
        query.Where($@"PhoneNumber like '%{options.SearchText}%' or 
                    Name like '%{options.SearchText}%' or
                    Lastname like '%{options.SearchText}%' or
                    Email like '%{options.SearchText}%'");

        return await query.QueryAsync<UserEntity>();
    }

    public async Task<UserEntity> Get(Guid id)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select 
                Id, 
                PhoneNumber, 
                Name, 
                Lastname, 
                Email, 
                BirthDay as BirthDayDateTime 
            from Users
            where Id = {id}
        ").QuerySingleAsync<UserEntity>();
    }

    public async Task<UserEntity> Get(string phoneNumber)
    {
        using var connection = GetConnection();

        return await connection.QueryBuilder($@"
            select 
                Id, 
                PhoneNumber, 
                Name, 
                Lastname, 
                Email, 
                BirthDay as BirthDayDateTime 
            from Users
            where PhoneNumber = {phoneNumber}
        ").QuerySingleAsync<UserEntity>();
    }

    public async Task Update(UserEntity entity)
    {
        using var connection = GetConnection();
        await connection.QueryBuilder($@"
            update Users
            set
                PhoneNumber = {entity.PhoneNumber},
                Password = {entity.Password},
                Name = {entity.Name},
                Lastname ={entity.Lastname},
                Email = {entity.Email},
                BirthDay = {entity.BirthDayDateTime}
            where Id = {entity.Id}            
        ").ExecuteAsync();
    }
}
