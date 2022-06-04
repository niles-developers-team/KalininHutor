using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206046)]
public class CreateRoomVariantCharacteristics : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("RoomVariantCharacteristics")
        .WithDescription("")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("RoomVariantId").AsGuid().NotNullable().ForeignKey("RoomVariants", "Id").WithColumnDescription("Идентификатор владельца")
            .WithColumn("RoomCharacteristicId").AsGuid().NotNullable().ForeignKey("RoomCharacteristics", "Id").WithColumnDescription("Название объекта аренды")
            .WithColumn("Price").AsDecimal().NotNullable().WithColumnDescription("Описание объекта аренды");
    }
}