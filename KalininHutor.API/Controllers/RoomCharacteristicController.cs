using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using KalininHutor.API.Queries;
using KalininHutor.API.Requests;

namespace KalininHutor.API.Controllers;

///<summary> Контроллер  объектов аренды </summary>
[Route("api/[controller]")]
[ApiController]
public class RoomCharacteristicController : ControllerBase
{
    private readonly ISender _sender;

    ///<summary> Конструктор контроллера </summary>
    public RoomCharacteristicController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    ///<summary> Метод получения коллекции объектов аренды </summary>
    [HttpGet()]
    [Authorize]
    public async Task<IActionResult> Get([FromQuery] RoomCharacteristic.GetQuery query)
    {
        var result = await _sender.Send(query);

        return Ok(result);
    }

    ///<summary> Метод создания объекта аренды </summary>
    [HttpPost()]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] RoomCharacteristic.CreateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод обновления объекта аренды </summary>
    [HttpPatch()]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] RoomCharacteristic.UpdateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод удаления объекта аренды  </summary>
    [HttpDelete()]
    [Authorize]
    public async Task<IActionResult> Delete([FromQuery] RoomCharacteristic.DeleteRequest request) => Ok(await _sender.Send(request));
}