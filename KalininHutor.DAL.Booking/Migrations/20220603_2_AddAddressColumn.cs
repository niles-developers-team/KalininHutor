using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206032)]
public class AddAddressColumn : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Column("Address")
        .OnTable("RentalObjects")
        .AsString()
        .NotNullable();
    }
}