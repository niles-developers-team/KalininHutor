using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220728_16)]
public class AppendBookingNumber : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Column("Number")
            .OnTable("Bookings")
            .AsInt64()
            .Identity()
            .NotNullable()
            .WithColumnDescription("Номер брони");
    }
}