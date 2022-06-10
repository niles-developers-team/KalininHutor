using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206046)]
public class CreateBooking : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("Bookings")
            .WithDescription("Таблица брони")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор брони")
            .WithColumn("TenantId").AsGuid().NotNullable().WithColumnDescription("Идентификатор арендатора")
            .WithColumn("RentalObjectId").AsGuid().NotNullable().ForeignKey("RentalObjects", "Id").WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("AdultCount").AsInt32().NotNullable().WithColumnDescription("Количество взрослых")
            .WithColumn("ChildCount").AsInt32().NotNullable().WithColumnDescription("Количество детей")
            .WithColumn("CheckinDate").AsDate().NotNullable().WithColumnDescription("Дата заезда")
            .WithColumn("CheckoutDate").AsDate().NotNullable().WithColumnDescription("Дата отъезда")
            .WithColumn("Total").AsDecimal().NotNullable().WithColumnDescription("Всего за бронь");
    }
}