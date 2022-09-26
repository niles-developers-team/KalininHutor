using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using KalininHutor.API.Commands;

namespace KalininHutor.API.Controllers;

///<summary> Контроллер  объектов аренды </summary>
[Route("api/[controller]")]
[ApiController]
public class RentalObjectController : ControllerBase
{
    private readonly ISender _sender;

    ///<summary> Конструктор контроллера </summary>
    public RentalObjectController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    ///<summary> Метод получения коллекции объектов аренды </summary>
    [HttpGet()]
    public async Task<IActionResult> Get([FromQuery] RentalObjectCommands.GetQuery query)
    {
        try
        {
            var result = await _sender.Send(query);
            return Ok(result);
        }
        catch (Exception exc)
        {
            return BadRequest(exc.Message);
        }
    }

    ///<summary> Метод создания объекта аренды </summary>
    [HttpPost()]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] RentalObjectCommands.CreateRequest request)
    {
        try
        {
            return Ok(await _sender.Send(request));
        }
        catch (Exception exc)
        {
            return StatusCode(500, exc.Message);
        }
    }

    ///<summary> Метод обновления объекта аренды </summary>
    [HttpPatch()]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] RentalObjectCommands.UpdateRequest request)
    {
        try
        {
            return Ok(await _sender.Send(request));
        }
        catch (Exception exc)
        {
            return StatusCode(500, exc.Message);
        }
    }

    ///<summary> Метод удаления объекта аренды  </summary>
    [HttpDelete()]
    [Authorize]
    public async Task<IActionResult> Delete([FromBody] RentalObjectCommands.DeleteRequest request)
    {
        try
        {
           return Ok(await _sender.Send(request));
        }
        catch (Exception exc)
        {
            return BadRequest(exc.Message);
        }
    }
}