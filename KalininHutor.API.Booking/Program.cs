using KalininHutor.API.Booking.Mappers;
using FluentMigrator.Runner;
using KalininHutor.DAL.Migrations;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Postgres");

builder.Services.AddControllers();
builder.Services.AddRouting();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddFluentMigratorCore()
       .ConfigureRunner(config =>
              config.AddPostgres()
              .WithGlobalConnectionString(connectionString)
              .ScanIn(typeof(CreateRentalObjectTable).Assembly).For.Migrations()
       );
builder.Logging.ClearProviders().AddFluentMigratorConsole().AddConsole().AddDebug();
builder.Services.AddAutoMapper(typeof(AppMappingProfile));

var app = builder.Build();
using var scope = app.Services.CreateScope();
var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
var logger = loggerFactory.CreateLogger("Program");

try
{
    logger.LogInformation("Запуск миграций");
    var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();
    runner.MigrateUp();
    logger.LogInformation("Миграции успешно применены");
}
catch (Exception exc)
{
    logger.LogError($"Ошибка миграций: {exc.Message}");
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});
app.MapControllers();
app.Run();