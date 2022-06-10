using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206045)]
public class CreateRoomVariantCharacteristics : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("RoomVariantCharacteristics")
            .WithDescription("Таблица харакеристик варианта номера")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор характеристики варианта номера")
            .WithColumn("RoomVariantId").AsGuid().NotNullable().ForeignKey("RoomVariants", "Id").WithColumnDescription("Идентификатор варианта номера")
            .WithColumn("RoomCharacteristicId").AsGuid().NotNullable().ForeignKey("RoomCharacteristics", "Id").WithColumnDescription("Идентификатор характеристики")
            .WithColumn("Price").AsDecimal().NotNullable().WithColumnDescription("Цена харакетистики варианта номера");
    }
}