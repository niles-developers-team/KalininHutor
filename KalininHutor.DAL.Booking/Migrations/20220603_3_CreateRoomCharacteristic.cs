using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206023)]
public class CreateRoomCharacteristic : ForwardOnlyMigration
{
    public override void Up()
    {
        var tableName = "RoomCharacteristics";

        Create.Table(tableName)
            .WithDescription("Справочник харакетристик варианта номера")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор характеристики")
            .WithColumn("Name").AsString().NotNullable().WithColumnDescription("Название характеристики")
            .WithColumn("Description").AsString().NotNullable().WithColumnDescription("Описание харакетирстики")
            .WithColumn("Type").AsInt32().NotNullable().WithColumnDescription("Тип (Зона) харакетистики");
    }
}