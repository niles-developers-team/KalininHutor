using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206047)]
public class CreateBooking : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("Bookings")
            .WithDescription("")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("RentalObjectId").AsGuid().NotNullable().ForeignKey("RentalObjects", "Id").WithColumnDescription("Идентификатор владельца")
            .WithColumn("AdultCount").AsInt32().NotNullable().WithColumnDescription("Название объекта аренды")
            .WithColumn("ChildCount").AsInt32().NotNullable().WithColumnDescription("Описание объекта аренды")
            .WithColumn("CheckinDate").AsDate().NotNullable().WithColumnDescription("Описание объекта аренды")
            .WithColumn("CheckoutDate").AsDate().NotNullable().WithColumnDescription("Описание объекта аренды")
            .WithColumn("Total").AsDecimal().NotNullable().WithColumnDescription("Описание объекта аренды");
    }
}