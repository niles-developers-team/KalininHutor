using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220724_14)]
public class AppendTenantInfo : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Column("TenantName")
            .OnTable("Bookings")
            .AsString()
            .NotNullable();
        Create.Column("TenantLastName")
            .OnTable("Bookings")
            .AsString()
            .NotNullable();
        Create.Column("TenantEmail")
            .OnTable("Bookings")
            .AsString()
            .NotNullable();
        Create.Column("TenantPhone")
            .OnTable("Bookings")
            .AsString()
            .Nullable();
    }
}