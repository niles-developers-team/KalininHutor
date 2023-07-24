using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20230723_23)]
public class AddCoordinatesToRentalObject : ForwardOnlyMigration
{
    public override void Up()
    {
        Alter.Table("RentalObjects")
        .AddColumn("Latitude").AsFloat().Nullable().WithColumnDescription("Широта")
        .AddColumn("Longitude").AsFloat().Nullable().WithColumnDescription("Долгота");
    }
}