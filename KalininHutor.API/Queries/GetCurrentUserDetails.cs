using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Helpers;
using KalininHutor.DAL.Identity;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetCurrentUserDetailsHandler : IRequestHandler<UserCommands.GetCurrentUserDetailsQuery, UserDetailsDTO>
{
    private readonly ISender _sender;
    private readonly UserRepository _repository;
    private readonly HttpContext _context;

    public GetCurrentUserDetailsHandler(UserRepository repository, IHttpContextAccessor contextAccessor, ISender sender)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _context = contextAccessor != null && contextAccessor.HttpContext != null ? contextAccessor.HttpContext : throw new ArgumentNullException(nameof(contextAccessor));
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    public async Task<UserDetailsDTO> Handle(UserCommands.GetCurrentUserDetailsQuery request, CancellationToken cancellationToken)
    {
        var claim = _context.User.FindFirst("id");
        if (claim == null || claim.Value == null)
            throw new ApplicationException();

        var id = Guid.Parse(claim.Value);

        return await _sender.Send(new UserCommands.GetDetailsQuery { Id = id });
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Очередь получения деталей пользователя </summary>
    public class GetCurrentUserDetailsQuery : IRequest<UserDetailsDTO> { }
}