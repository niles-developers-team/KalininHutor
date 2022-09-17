using KalininHutor.API.Requests;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KalininHutor.API.Controllers;

///<summary> Контроллер броней </summary>
[Route("api/[controller]")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly ISender _sender;

    ///<summary> Конструктор контроллера </summary>
    public NotificationController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    ///<summary> Метод получения коллекции броней </summary>
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] NotificationCommands.Get query) => Ok(await _sender.Send(query));

    ///<summary> Метод создания брони </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NotificationCommands.Create request) => Ok(await _sender.Send(request));

    ///<summary> Метод изменения брони </summary>
    [HttpPatch("mark-as-read")]
    public async Task<IActionResult> ReadNotification([FromBody] Guid id) => Ok(await _sender.Send(new NotificationCommands.Update { Id = id, Read = true }));

    ///<summary> Метод удаления брони </summary>
    [HttpDelete]
    public async Task<IActionResult> Delete(NotificationCommands.Delete request) => Ok(await _sender.Send(request));
}