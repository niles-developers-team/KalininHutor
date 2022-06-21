using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Helpers;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetCurrentUserDetailsHandler : IRequestHandler<UserQueries.GetCurrentUserDetailsQuery, UserDetailsDTO>
{
    private readonly ISender _sender;
    private readonly UserRepository _repository;
    private readonly HttpContext _context;

    public GetCurrentUserDetailsHandler(UserRepository repository, IHttpContextAccessor contextAccessor, ISender sender)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _context = contextAccessor == null ? throw new ArgumentNullException(nameof(contextAccessor)) : contextAccessor.HttpContext;
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    public async Task<UserDetailsDTO> Handle(UserQueries.GetCurrentUserDetailsQuery request, CancellationToken cancellationToken)
    {
        var claim = _context.User.FindFirst("id");
        if (claim == null || claim.Value == null)
            throw new ApplicationException();

        var id = Guid.Parse(claim.Value);

        return await _sender.Send(new UserQueries.GetDetailsQuery { Id = id });
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserQueries
{
    ///<summary> Очередь получения деталей пользователя </summary>
    public class GetCurrentUserDetailsQuery : IRequest<UserDetailsDTO>
    {
    }
}