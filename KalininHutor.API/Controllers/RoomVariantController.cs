using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using KalininHutor.API.Requests;

namespace KalininHutor.API.Controllers;

///<summary> Контроллер  объектов аренды </summary>
[Route("api/[controller]")]
[ApiController]
public class RoomVariantController : ControllerBase
{
    private readonly ISender _sender;

    ///<summary> Конструктор контроллера </summary>
    public RoomVariantController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    ///<summary> Метод получения коллекции объектов аренды </summary>
    [HttpGet()]
    public async Task<IActionResult> Get([FromQuery] RoomVariantCommands.GetQuery query)
    {
        var result = await _sender.Send(query);

        return Ok(result);
    }

    ///<summary> Метод создания объекта аренды </summary>
    [HttpPost()]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] RoomVariantCommands.CreateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод обновления объекта аренды </summary>
    [HttpPatch()]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] RoomVariantCommands.UpdateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод удаления объекта аренды  </summary>
    [HttpDelete()]
    [Authorize]
    public async Task<IActionResult> Delete([FromBody] RoomVariantCommands.DeleteRequest request) => Ok(await _sender.Send(request));
}