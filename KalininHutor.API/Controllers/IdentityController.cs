using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using KalininHutor.API.Requests;

namespace KalininHutor.API.Controllers;

///<summary> Контроллер пользователей </summary>
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly ISender _sender;

    ///<summary> Конструктор контроллера </summary>
    public UserController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    ///<summary> Метод получения данных о текущем пользователе </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        try
        {
            return base.Ok(await _sender.Send(new UserCommands.GetCurrentUserDetailsQuery()));
        }
        catch (ApplicationException)
        {
            return Unauthorized();
        }
    }

    ///<summary> Метод авторизации </summary>
    [HttpPost("sign-in")]
    [AllowAnonymous]
    public async Task<IActionResult> Signin([FromBody] UserCommands.SigninRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод регистрации </summary>
    [HttpPost("sign-up")]
    [AllowAnonymous]
    public async Task<IActionResult> Signup([FromBody] Requests.UserCommands.SignupRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод изменения пользователя </summary>
    [HttpPatch("update")]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] Requests.UserCommands.UpdateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод удаления пользователя </summary>
    [HttpDelete()]
    [Authorize]
    public async Task<IActionResult> Delete([FromBody] Requests.UserCommands.DeleteRequest request) => Ok(await _sender.Send(request));
}