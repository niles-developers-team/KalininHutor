using KalininHutor.API.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

    ///<summary> Метод авторизации </summary>
    [HttpPost("sign-in")]
    [AllowAnonymous]
    public async Task<IActionResult> Signin([FromBody]UserSigninRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод регистрации </summary>
    [HttpPost("sign-up")]
    [AllowAnonymous]
    public async Task<IActionResult> Signup([FromBody]UserSignupRequest request) => Ok(await _sender.Send(request));
}