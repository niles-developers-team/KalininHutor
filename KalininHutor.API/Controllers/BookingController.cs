using KalininHutor.API.Requests;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KalininHutor.API.Controllers;

///<summary> Контроллер броней </summary>
[Route("api/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{
    private readonly ISender _sender;

    ///<summary> Конструктор контроллера </summary>
    public BookingController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }

    ///<summary> Метод получения коллекции броней </summary>
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Booking.GetQuery query) => Ok(await _sender.Send(query));

    ///<summary> Метод создания брони </summary>
    [HttpPost]
    public async Task<IActionResult> Create(Booking.CreateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод изменения брони </summary>
    [HttpPatch]
    public async Task<IActionResult> Update(Booking.UpdateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод удаления брони </summary>
    [HttpDelete]
    public async Task<IActionResult> Delete(Booking.UpdateRequest request) => Ok(await _sender.Send(request));
}