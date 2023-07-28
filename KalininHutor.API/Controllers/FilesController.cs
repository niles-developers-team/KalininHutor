using KalininHutor.API.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KalininHutor.API.Controllers;

///<summary> Контроллер броней </summary>
[Route("api/[controller]")]
[ApiController]
public class FilesController : ControllerBase
{
    private readonly ISender _sender;

    ///<summary> Конструктор контроллера </summary>
    public FilesController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }
    
    ///<summary> Метод получения коллекции броней </summary>
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] FileCommands.GetQuery query) => Ok(await _sender.Send(query));
}