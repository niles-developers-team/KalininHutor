using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220724_15)]
public class AppendBookingStatus : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Column("Status")
            .OnTable("Bookings")
            .AsInt32()
            .NotNullable()
            .WithDefaultValue(0)
            .WithColumnDescription("Статус брони");
    }
}