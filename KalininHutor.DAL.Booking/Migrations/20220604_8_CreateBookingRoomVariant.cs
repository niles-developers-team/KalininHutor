using FluentMigrator;

namespace KalininHutor.DAL.Booking;

[Migration(202206048)]
public class CreateBookingRoomVariant : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("BookingRoomVariants")
            .WithDescription("")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("RoomVariantId").AsGuid().NotNullable().ForeignKey("RentalObjects", "Id").WithColumnDescription("Идентификатор владельца")
            .WithColumn("BookingId").AsGuid().NotNullable().ForeignKey("Bookings", "Id").WithColumnDescription("Название объекта аренды")
            .WithColumn("Amount").AsDecimal().NotNullable().WithColumnDescription("Описание объекта аренды");
    }
}