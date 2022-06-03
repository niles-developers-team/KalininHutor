using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206025)]
public class CreateRoomVariantBedType : ForwardOnlyMigration
{
    public override void Up()
    {
        var tableName = "RoomVariants";

        Create.Table(tableName)
            .WithDescription("Таблица вариантов номеров объекта аренды")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор варинта кровати")
            .WithColumn("RoomVariantId").AsGuid().ForeignKey("RentalObjects", "Id").NotNullable().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("BedType").AsString().NotNullable().WithColumnDescription("Тип кровати")
            .WithColumn("Width").AsString().NotNullable().WithColumnDescription("Ширина кровати")
            .WithColumn("Length").AsDecimal().NotNullable().WithColumnDescription("Длина кровати")
            .WithColumn("MaxInRoom").AsDecimal().NotNullable().WithColumnDescription("Максимальное количество");
    }
}