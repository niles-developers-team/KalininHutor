using KalininHutor.API.Queries;
using KalininHutor.API.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KalininHutor.API.Controllers;

using BookingQueryies = API.Queries.Booking;
using BookingRequests = API.Requests.Booking;

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
    public async Task<IActionResult> Get(BookingQueryies.GetQuery query) => Ok(await _sender.Send(query));

    ///<summary> Метод создания брони </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(BookingRequests.CreateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод изменения брони </summary>
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update(BookingRequests.UpdateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод удаления брони </summary>
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete(BookingRequests.UpdateRequest request) => Ok(await _sender.Send(request));
}