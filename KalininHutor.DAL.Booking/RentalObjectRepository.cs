using DapperQueryBuilder;
using KalininHutor.DAL.Common;
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
            insert into RentalObjects(Id, LandlordId, Address, Name, Description, CheckinTime, CheckoutTime, Latitude, Longitude)
            values (
                {entity.Id}, 
                {entity.LandlordId}, 
                {entity.Address},
                {entity.Name}, 
                {entity.Description}, 
                {entity.CheckinTimeSpan}, 
                {entity.CheckoutTimeSpan},
                {entity.Latitude},
                {entity.Longitude}
            );
        ").ExecuteAsync();
    }

    public async Task Delete(IReadOnlyList<Guid> ids)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        await connection.QueryBuilder($@"delete from RentalObjects where Id = any({ids})").ExecuteAsync();
    }

    public async Task Update(RentalObjectEntity entity)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        await connection.QueryBuilder($@"
            update RentalObjects
            set Name = {entity.Name}, 
                Address = {entity.Address},
                Description = {entity.Description}, 
                CheckinTime = {entity.CheckinTimeSpan}, 
                CheckoutTime = {entity.CheckoutTimeSpan},
                Latitude = {entity.Latitude},
                Longitude = {entity.Longitude}
            where Id = {entity.Id}
        ").ExecuteAsync();
    }

    public async Task<IEnumerable<RentalObjectEntity>> Get(RentalObjectSearchOptions options)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        var query = connection.QueryBuilder($@"
            select
            	r.Id,
            	r.LandlordId,
            	r.Name,
            	r.Address,
            	r.Description,
            	r.CheckinTime as CheckinTimeSpan,
            	r.CheckoutTime as CheckoutTimeSpan,
                r.Latitude,
                r.Longitude
            from RentalObjects r     
            /**where**/
        ");

        if (options.Id.HasValue)
            query.Where($"Id = {options.Id}");

        if (!string.IsNullOrEmpty(options.SearchText))
            query.Where($"(Name like concat('%', {options.SearchText}, '%') or Address like concat('%', {options.SearchText}, '%'))");

        if (options.CheckinTime.HasValue)
            query.Where($"(CheckinTime >= {options.CheckinTimeSpan})");

        if (options.CheckoutTime.HasValue)
            query.Where($"(CheckoutTime <= {options.CheckoutTimeSpan})");

        if (options.AdultsCount.HasValue)
            query.Where($"(select min(RoomVariants.MaxPersonsCount) from RoomVariants where RoomVariants.RentalObjectId = r.Id) >= {options.AdultsCount + (options.ChildsCount ?? 0)}");

        if (options.RoomsCount.HasValue)
            query.Where($"(select min(RoomVariants.FreeCount) from RoomVariants where RoomVariants.RentalObjectId = r.Id) >= {options.RoomsCount}");

        if (options.LandlordId.HasValue)
            query.Where($"LandlordId = {options.LandlordId}");

        if (options.SelectedCharacteristicsIds != null && options.SelectedCharacteristicsIds.Any())
            query.Where($@"Id in (
	                select rv.RentalObjectId from RoomVariants rv
	                inner join RoomVariantCharacteristics rvc on rv.Id = rvc.RoomVariantId
	                where rvc.RoomCharacteristicId = any({options.SelectedCharacteristicsIds})
                )
            ");

        if(options.MinPrice.HasValue && options.MinPrice > 0)
            query.Where($@"(select max(RoomVariants.Price) from RoomVariants where RoomVariants.RentalObjectId = r.Id) >= {options.MinPrice}");

        if(options.MaxPrice.HasValue && options.MaxPrice > 0)
            query.Where($@"(select min(RoomVariants.Price) from RoomVariants where RoomVariants.RentalObjectId = r.Id) <= {options.MaxPrice}");

        if (options.Ids != null && options.Ids.Any())
            query.Where($@"Id = any({options.Ids})");

        return await query.QueryAsync<RentalObjectEntity>();
    }

    public async Task<RentalObjectEntity> Get(Guid id)
    {
        using var connection = new NpgsqlConnection(_connectionString);

        var query = connection.QueryBuilder($@"
            select
                Id,
                LandlordId,
                Name,
                Address,
                Description,
                CheckinTime as CheckinTimeSpan,
                CheckoutTime as CheckoutTimeSpan
            from RentalObjects            
            where Id = {id}
        ");

        return await query.QuerySingleOrDefaultAsync<RentalObjectEntity>();
    }
}