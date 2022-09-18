using KalininHutor.API.DTO;

namespace KalininHutor.API.Providers;

///<summary> Провайдер авторизованных пользователей </summary>
public class JwtUserProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    ///<summary> Конструктор провайдера </summary>
    public JwtUserProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    ///<summary> Получение пользователя для хаба </summary>
    public HubUser? GetUser()
    {
        var userId = GetUserId();
        if (!userId.HasValue) return null;

        return new HubUser { Id = userId.Value };
    }

    ///<summary> Получение Id текущего пользователя </summary>
    public Guid? GetUserId()
    {
        //DefaultUserIdProvider
        var claim = _httpContextAccessor.HttpContext?.User.FindFirst("id");
        if (claim == null) return null;
        Guid.TryParse(claim.Value, out var userId);
        return userId;
    }
}