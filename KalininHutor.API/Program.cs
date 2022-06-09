using Microsoft.AspNetCore.Mvc;

using FluentMigrator.Runner;
using MediatR;
using TinyHelpers.Json.Serialization;

using KalininHutor.API.Mappers;
using KalininHutor.DAL.Booking;
using KalininHutor.DAL.Migrations;
using KalininHutor.API.Helpers;
using KalininHutor.DAL.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;

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

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
builder.Services.AddScoped<BookingRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<BookingRepository>>();
    return new BookingRepository(connectionString, logger);
});
builder.Services.AddScoped<BookingRoomVariantRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<BookingRoomVariantRepository>>();
    return new BookingRoomVariantRepository(connectionString, logger);
});
builder.Services.AddScoped<BookingRoomVariantBedTypeRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<BookingRoomVariantBedTypeRepository>>();
    return new BookingRoomVariantBedTypeRepository(connectionString, logger);
});
builder.Services.AddScoped<RentalObjectRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<RentalObjectRepository>>();
    return new RentalObjectRepository(connectionString, logger);
});
builder.Services.AddScoped<RoomCharacteristicRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<RoomCharacteristicRepository>>();
    return new RoomCharacteristicRepository(connectionString, logger);
});
builder.Services.AddScoped<RoomVariantBedTypeRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<RoomVariantBedTypeRepository>>();
    return new RoomVariantBedTypeRepository(connectionString, logger);
});
builder.Services.AddScoped<RoomVariantCharacteristicRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<RoomVariantCharacteristicRepository>>();
    return new RoomVariantCharacteristicRepository(connectionString, logger);
});
builder.Services.AddScoped<RoomVariantRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<RoomVariantRepository>>();
    return new RoomVariantRepository(connectionString, logger);
});
builder.Services.AddScoped<UserRepository>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<UserRepository>>();
    return new UserRepository(connectionString, logger);
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
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors(configure => configure.SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});
app.MapControllers();
app.Run();