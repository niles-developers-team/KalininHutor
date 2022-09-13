using KalininHutor.API.DTO;

namespace KalininHutor.API.Providers;
public class JwtUserProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public JwtUserProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    public async Task<HubUser> GetUserAsync()
    {
        var userId = GetUserId();
        if (!userId.HasValue) return null;

        return new HubUser { Id = userId.Value };
    }

    public Guid? GetUserId()
    {
        //DefaultUserIdProvider
        var claim = _httpContextAccessor.HttpContext?.User.FindFirst("id");
        if (claim == null) return null;
        Guid.TryParse(claim.Value, out var userId);
        return userId;
    }
}