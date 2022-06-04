using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206024)]
public class CreateRoomVariantBedType : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("RoomVariantBedTypes")
            .WithDescription("Таблица вариантов кровати номера объекта аренды")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор варинта кровати номера")
            .WithColumn("RoomVariantId").AsGuid().ForeignKey("RoomVariants", "Id").NotNullable().WithColumnDescription("Идентификатор варианта номера")
            .WithColumn("BedType").AsInt32().NotNullable().WithColumnDescription("Тип кровати")
            .WithColumn("Width").AsDouble().Nullable().WithColumnDescription("Ширина кровати")
            .WithColumn("Length").AsDouble().Nullable().WithColumnDescription("Длина кровати")
            .WithColumn("MaxInRoom").AsInt32().NotNullable().WithColumnDescription("Максимальное количество");
    }
}