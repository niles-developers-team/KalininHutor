using FluentMigrator;

namespace KalininHutor.DAL.Booking.Migrations;

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
            .WithColumn("PriceForAdult").AsDecimal().NotNullable().WithColumnDescription("Цена за взрослого")
            .WithColumn("PriceForChild").AsDecimal().NotNullable().WithColumnDescription("Цена за ребёнка")
            .WithColumn("Width").AsDouble().NotNullable().WithColumnDescription("Длина варианта номера")
            .WithColumn("Length").AsDouble().NotNullable().WithColumnDescription("Ширина варианта номера")
            .WithColumn("MaxPersonsCount").AsInt32().NotNullable().WithColumnDescription("Максимально человек в номере")
            .WithColumn("IsFreeCancellationEnabled").AsBoolean().NotNullable().WithColumnDescription("Возможна ли бесплатная отмена?")
            .WithColumn("FreeCancellationPeriod").AsInt32().Nullable().WithColumnDescription("Период бесплатной отмены")
            .WithColumn("PaymentOption").AsInt32().NotNullable().WithColumnDescription("Вариант оплаты")
            .WithColumn("Amount").AsInt32().NotNullable().WithColumnDescription("Всего номеров")            
            .WithColumn("FreeAmount").AsInt32().NotNullable().WithColumnDescription("Всего номеров свободно");
    }
}