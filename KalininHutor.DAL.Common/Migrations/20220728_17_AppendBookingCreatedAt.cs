using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220728_17)]
public class AppendBookingCreatedAt : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Column("CreatedAt")
            .OnTable("Bookings")
            .AsDate()
            .NotNullable()
            .WithDefaultValue(DateTime.Now)
            .WithColumnDescription("Дата создания брони");
    }
}