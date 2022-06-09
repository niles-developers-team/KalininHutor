using Microsoft.AspNetCore.Mvc;

using FluentMigrator.Runner;
using MediatR;
using TinyHelpers.Json.Serialization;

using KalininHutor.API.Mappers;
using KalininHutor.DAL.Booking;
using KalininHutor.DAL.Migrations;
using Microsoft.IdentityModel.Tokens;
using KalininHutor.API.Helpers;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Postgres");

builder.Services.AddControllers();
builder.Services.AddRouting();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<JsonOptions>(options =>
{
    options.JsonSerializerOptions.Converters.Add(new DateOnlyConverter());
    options.JsonSerializerOptions.Converters.Add(new TimeOnlyConverter());
});

builder.Services.Configure<AppSettings>(builder.Configuration);

builder.Services.AddAuthentication()
        .AddJwtBearer(options => { options.RequireHttpsMetadata = false; });
builder.Services.AddAuthorization();
builder.Services.AddCors();

builder.Services.AddFluentMigratorCore()
       .ConfigureRunner(config =>
              config.AddPostgres()
              .ConfigureGlobalProcessorOptions(opt =>
                {
                    opt.ProviderSwitches = "Force Quote=false";
                })
              .WithGlobalConnectionString(connectionString)
              .ScanIn(typeof(CreateRentalObjectTable).Assembly).For.Migrations()
       );
builder.Logging.ClearProviders().AddFluentMigratorConsole().AddConsole().AddDebug();
builder.Services.AddAutoMapper(typeof(AppMappingProfile));

builder.Services.AddScoped<JWTHelper>();
builder.Services.AddScoped<RentalObjectRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<RentalObjectRepository>>();
    return new RentalObjectRepository(connectionString, logger);
});

builder.Services.AddMediatR(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
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
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors(configure => configure.SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
app.UseRouting();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});
app.MapControllers();
app.Run();