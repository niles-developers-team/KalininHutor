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
    public async Task<IActionResult> Get([FromQuery] BookingCommands.GetQuery query) => Ok(await _sender.Send(query));

    ///<summary> Метод получения коллекции броней арендодателя </summary>
    [HttpGet("landlord-bookings")]
    public async Task<IActionResult> GetLandlordBookings([FromQuery] Guid landlordId, bool onlyNotApproved) =>
        Ok(await _sender.Send(new BookingCommands.GetQuery { LandlordId = landlordId, OnlyNotApproved = onlyNotApproved }));

    ///<summary> Метод создания брони </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BookingCommands.CreateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод изменения брони </summary>
    [HttpPatch]
    public async Task<IActionResult> Update([FromBody] BookingCommands.UpdateRequest request) => Ok(await _sender.Send(request));

    ///<summary> Метод подтверждения брони </summary>
    [HttpPatch("approve")]
    public async Task<IActionResult> ApproveBooking([FromQuery] Guid bookingId) => 
        Ok(await _sender.Send(new BookingCommands.ApproveRequest() { Id = bookingId }));

    ///<summary> Метод удаления брони </summary>
    [HttpDelete]
    public async Task<IActionResult> Delete(BookingCommands.DeleteRequest request) => Ok(await _sender.Send(request));
}