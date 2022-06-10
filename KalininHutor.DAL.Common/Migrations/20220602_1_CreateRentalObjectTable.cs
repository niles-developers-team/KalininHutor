using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206021)]
public class CreateRentalObjectTable : ForwardOnlyMigration
{
    public override void Up()
    {
        var tableName = "RentalObjects";

        Create.Table(tableName)
            .WithDescription("Таблица объектов аренды")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("LandlordId").AsGuid().NotNullable().WithColumnDescription("Идентификатор владельца")
            .WithColumn("Name").AsString().NotNullable().WithColumnDescription("Название объекта аренды")
            .WithColumn("Description").AsString().NotNullable().WithColumnDescription("Описание объекта аренды")
            .WithColumn("Address").AsString().NotNullable().WithColumnDescription("Адрес объекта аренды")
            .WithColumn("CheckinTime").AsTime().NotNullable().WithColumnDescription("Время заезда")
            .WithColumn("CheckoutTime").AsTime().NotNullable().WithColumnDescription("Время отъезда");
    }
}