using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(2022060810)]
public class AddUserForeignKeys : ForwardOnlyMigration
{
    public override void Up()
    {
        Alter.Table("RentalObjects")
        .AlterColumn("LandlordId").AsGuid().NotNullable().ForeignKey("Users", "Id");
        
        Alter.Table("Bookings")
        .AlterColumn("TenantId").AsGuid().NotNullable().ForeignKey("Users", "Id");
    }
}