using DapperQueryBuilder;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace KalininHutor.DAL.Booking;

public class RentalObjectRepository : IRepository<RentalObjectEntity, RentalObjectSearchOptions>
{
    private readonly ILogger<RentalObjectRepository> _logger;
    private readonly string _connectionString;

    public RentalObjectRepository(string connectionString, ILogger<RentalObjectRepository> logger)
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Create(RentalObjectEntity entity)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        await connection.QueryBuilder($@"
            insert into RentalObjects(Id, OwnerId, Name, Description, CheckinTime, CheckoutTime)
            values (
                {entity.Id}, 
                {entity.LandlordId}, 
                {entity.Name}, 
                {entity.Description}, 
                {entity.CheckinTimeSpan}, 
                {entity.CheckoutTimeSpan}
            );
        ").ExecuteAsync();
    }

    public async Task Delete(Guid id)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        await connection.QueryBuilder($@"
            delete from RentalObjects
            where Id = {id}
        ").ExecuteAsync();
    }

    public async Task Update(RentalObjectEntity entity)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        await connection.QueryBuilder($@"
            update RentalObjects
            set Name = {entity.Name}, 
                Description = {entity.Description}, 
                CheckinTime = {entity.CheckinTimeSpan}, 
                CheckoutTime = {entity.CheckoutTimeSpan}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }

    public async Task<IEnumerable<RentalObjectEntity>> Get(RentalObjectSearchOptions options)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        var query = connection.QueryBuilder($@"
            select
                Id,
                OwnerId,
                Name,
                Description,
                CheckinTime as CheckinTimeSpan,
                CheckoutTime as CheckoutTimeSpan
            from RentalObjects            
            /**where**/
        ");

        if (options.Id.HasValue)
            query.Where($"(Id = {options.Id})");

        if (!string.IsNullOrEmpty(options.SearchText))
            query.Where($"(Name like %{options.SearchText}% or Address like %{options.SearchText}%)");

        if(options.CheckinTime.HasValue)
            query.Where($"(CheckinTime > {options.CheckinTimeSpan})");

        if(options.CheckoutTime.HasValue)
            query.Where($"(CheckoutTime < {options.CheckoutTimeSpan})");

        return await query.QueryAsync<RentalObjectEntity>();
    }
}