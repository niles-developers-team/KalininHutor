namespace KalininHutor.DAL.Booking;

public class RentalObjectRepository : IRepository<RentalObjectEntity, RentalObjectSearchOptions>
{
    public Task<Guid> Create(RentalObjectEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task Update(RentalObjectEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task<List<RentalObjectEntity>> Get(RentalObjectSearchOptions options)
    {
        throw new NotImplementedException();
    }
}