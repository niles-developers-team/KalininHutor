using FluentMigrator;

namespace KalininHutor.DAL.Booking.Migrations;

[Migration(202206048)]
public class CreateBookingRoomVariantBedType : ForwardOnlyMigration
{
    public override void Up()
    {        
        Create.Table("BookingRoomVariantBedTypes")
            .WithDescription("Таблица выбранных вариантов кроватей")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор выбранной кровати")
            .WithColumn("BookingRoomVariant").AsGuid().ForeignKey("BookingRoomVariants", "Id").NotNullable().WithColumnDescription("Идентификатор выбранного варианта номера")
            .WithColumn("BedType").AsInt32().NotNullable().WithColumnDescription("Тип кровати")
            .WithColumn("Count").AsInt32().NotNullable().WithColumnDescription("Количество выбранных кроватей");
    }
}