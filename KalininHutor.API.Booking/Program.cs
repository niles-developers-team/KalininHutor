using KalininHutor.API.Booking.Mappers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
       .Services.AddAutoMapper(typeof(AppMappingProfile));

var app = builder.Build();


app.UseHttpsRedirection();
app.MapControllers();
app.Run();