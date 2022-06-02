using Microsoft.AspNetCore.Mvc;
using MediatR;
using KalininHutor.API.Booking.Requests;
using KalininHutor.API.Booking.Queries;

namespace KalininHutor.API.Booking.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RentalObjectController : ControllerBase
{
    private readonly ISender _sender;

    public RentalObjectController(ISender sender)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
    }


    [HttpGet()]
    public async Task<IActionResult> Get([FromQuery]GetRentalObjectsQuery query)
    {
        var result = await _sender.Send(query);

        return Ok(result);
    }

    [HttpPost()]
    public async Task Create([FromBody]CreateRentalObjectRequest request) => Ok(await _sender.Send(request));

    [HttpPut()]
    public async Task Update([FromBody]UpdateRentalObjectRequest request) => Ok(await _sender.Send(request));

    [HttpDelete()]
    public async Task Delete([FromQuery]DeleteRentalObjectRequest request) => Ok(await _sender.Send(request));
}