using Microsoft.AspNetCore.Mvc;
using MediatR;
using KalininHutor.API.Booking.Requests;
using KalininHutor.API.Booking.Queries;

namespace KalininHutor.API.Booking.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RentalObjectController : ControllerBase
{
    private readonly IMediator _mediator;

    public RentalObjectController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost()]
    public async Task Create([FromBody]CreateRentalObjectRequest request) => Ok(await _mediator.Send(request));

    [HttpGet()]
    public async Task Get([FromQuery]GetRentalObjectsQuery query) => Ok(await _mediator.Send(query));

    [HttpPut()]
    public async Task Update([FromBody]UpdateRentalObjectRequest request) => Ok(await _mediator.Send(request));

    [HttpDelete()]
    public async Task Delete([FromQuery]DeleteRentalObjectRequest request) => Ok(await _mediator.Send(request));
}