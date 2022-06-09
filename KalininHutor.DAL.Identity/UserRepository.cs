using KalininHutor.DAL.Common;

namespace KalininHutor.DAL.Identity;

public class UserRepository : IRepository<UserEntity, UserSearchOptions>
{
    public Task Create(UserEntity entity)
    {
        throw new NotImplementedException();
    }

    public Task Delete(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<UserEntity>> Get(UserSearchOptions options)
    {
        throw new NotImplementedException();
    }

    public Task<UserEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<UserEntity> Get(string phoneNumber)
    {
        throw new NotImplementedException();
    }

    public Task Update(UserEntity entity)
    {
        throw new NotImplementedException();
    }
}
