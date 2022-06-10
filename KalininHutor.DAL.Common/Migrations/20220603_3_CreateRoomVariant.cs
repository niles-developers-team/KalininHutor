using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206023)]
public class CreateRoomVariant : ForwardOnlyMigration
{
    public override void Up()
    {
        var tableName = "RoomVariants";

        Create.Table(tableName)
            .WithDescription("Таблица вариантов номеров объекта аренды")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор варинта номера объекта аренды")
            .WithColumn("RentalObjectId").AsGuid().ForeignKey("RentalObjects", "Id").NotNullable().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("Name").AsString().NotNullable().WithColumnDescription("Название")
            .WithColumn("Description").AsString().NotNullable().WithColumnDescription("Описание")
            .WithColumn("Price").AsDecimal().NotNullable().WithColumnDescription("Цена за номер")
            .WithColumn("Width").AsDouble().NotNullable().WithColumnDescription("Длина варианта номера")
            .WithColumn("Length").AsDouble().NotNullable().WithColumnDescription("Ширина варианта номера")
            .WithColumn("MaxPersonsCount").AsInt32().NotNullable().WithColumnDescription("Максимально человек в номере")
            .WithColumn("FreeCancellationPeriod").AsInt32().Nullable().WithColumnDescription("Период бесплатной отмены")
            .WithColumn("PaymentOption").AsInt32().NotNullable().WithColumnDescription("Вариант оплаты")
            .WithColumn("Count").AsInt32().NotNullable().WithColumnDescription("Всего номеров")            
            .WithColumn("FreeCount").AsInt32().NotNullable().WithColumnDescription("Всего номеров свободно");
    }
}