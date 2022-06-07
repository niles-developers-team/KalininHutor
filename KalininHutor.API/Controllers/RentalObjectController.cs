using Microsoft.AspNetCore.Mvc;
using MediatR;
using KalininHutor.API.Requests;
using KalininHutor.API.Queries;

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
    public async Task<IActionResult> Get([FromQuery]GetRentalObjectsQuery query)
    {
        var result = await _sender.Send(query);

        return Ok(result);
    }

    ///<summary> Метод создания объекта аренды </summary>
    [HttpPost()]
    public async Task<IActionResult> Create([FromBody]CreateRentalObjectRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод обновления объекта аренды </summary>
    [HttpPut()]
    public async Task<IActionResult> Update([FromBody]UpdateRentalObjectRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод удаления объекта аренды  </summary>
    [HttpDelete()]
    public async Task<IActionResult> Delete([FromQuery]DeleteRentalObjectRequest request) => Ok(await _sender.Send(request));
}