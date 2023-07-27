using KalininHutor.DAL.Common;
using Microsoft.Extensions.Logging;

namespace KalininHutor.DAL.Identity;

public class UsersRolesRepository : BaseRepository<UserRoleEntity, Guid>
{
    public UsersRolesRepository(string connectionString, ILogger<BaseRepository<UserRoleEntity, Guid>> logger) : base(connectionString, logger) { }

    public override Task Create(UserRoleEntity entity)
    {
        throw new NotImplementedException();
    }

    public override Task Delete(IReadOnlyList<Guid> ids)
    {
        throw new NotImplementedException();
    }

    public override Task<IEnumerable<UserRoleEntity>> Get(Guid options)
    {
        throw new NotImplementedException();
    }

    public override Task<UserRoleEntity> Get(Guid id)
    {
        throw new NotImplementedException();
    }

    public override Task Update(UserRoleEntity entity)
    {
        throw new NotImplementedException();
    }
}