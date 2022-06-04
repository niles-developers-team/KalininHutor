using FluentMigrator;

namespace KalininHutor.DAL.Booking.Migrations;

[Migration(202206047)]
public class CreateBookingRoomVariant : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("BookingRoomVariants")
            .WithDescription("Таблица выбранных вариантов номеров")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор выбранного варианта номера")
            .WithColumn("RoomVariantId").AsGuid().NotNullable().ForeignKey("RentalObjects", "Id").WithColumnDescription("Идентификатор варианта номера")
            .WithColumn("BookingId").AsGuid().NotNullable().ForeignKey("Bookings", "Id").WithColumnDescription("Идентификатор брони")
            .WithColumn("Amount").AsDecimal().NotNullable().WithColumnDescription("Всего за номер");
    }
}