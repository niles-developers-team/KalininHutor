using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206048)]
public class CreateBookingRoomVariantBedType : ForwardOnlyMigration
{
    public override void Up()
    {        
        Create.Table("BookingRoomVariantBedTypes")
            .WithDescription("Таблица выбранных вариантов кроватей")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор выбранной кровати")
            .WithColumn("BookingRoomVariantId").AsGuid().ForeignKey("BookingRoomVariants", "Id").NotNullable().WithColumnDescription("Идентификатор выбранного варианта номера")
            .WithColumn("BedTypeId").AsGuid().ForeignKey("RoomVariantBedTypes", "Id").NotNullable().WithColumnDescription("Идентификатор варианта кровати номера")
            .WithColumn("Count").AsInt32().NotNullable().WithColumnDescription("Количество выбранных кроватей");
    }
}