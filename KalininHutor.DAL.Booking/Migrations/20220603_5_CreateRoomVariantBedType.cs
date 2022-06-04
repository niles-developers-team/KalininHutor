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
            .WithColumn("BedType").AsInt32().NotNullable().WithColumnDescription("Тип кровати")
            .WithColumn("Width").AsDouble().Nullable().WithColumnDescription("Ширина кровати")
            .WithColumn("Length").AsDouble().Nullable().WithColumnDescription("Длина кровати")
            .WithColumn("MaxInRoom").AsInt32().NotNullable().WithColumnDescription("Максимальное количество");
    }
}