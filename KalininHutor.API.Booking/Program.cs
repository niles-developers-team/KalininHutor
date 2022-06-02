using KalininHutor.API.Booking.Mappers;
using FluentMigrator.Runner;
using KalininHutor.DAL.Migrations;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Postgres");

builder.Services.AddControllers();
builder.Services.AddFluentMigratorCore()
       .ConfigureRunner(config =>
              config.AddPostgres()
              .WithGlobalConnectionString(connectionString)
              .ScanIn(typeof(CreateRentalObjectTable).Assembly).For.Migrations()
       )
       .AddLogging(config => config.AddFluentMigratorConsole().AddConsole());
builder.Services.AddAutoMapper(typeof(AppMappingProfile));

var app = builder.Build();
try
{
    using var scope = app.Services.CreateScope();
    var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();
    runner.MigrateUp();
}
catch (Exception exc)
{

}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();