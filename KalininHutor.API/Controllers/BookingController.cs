using KalininHutor.API.Queries;
using KalininHutor.API.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public async Task<IActionResult> Get(GetBookingsQuery query) => Ok(await _sender.Send(query));

    ///<summary> Метод создания брони </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateBookingRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод изменения брони </summary>
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update(UpdateBookingRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод удаления брони </summary>
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete(DeleteBookingRequest request) => Ok(await _sender.Send(request));
}