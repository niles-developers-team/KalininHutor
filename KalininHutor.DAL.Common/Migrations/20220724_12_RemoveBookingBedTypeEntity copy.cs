using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220724_12)]
public class RemoveBookingBedTypeEntity : ForwardOnlyMigration
{
    public override void Up()
    {
        Delete.Table("BookingRoomVariantBedTypes");

        Create.Column("BedType")
            .OnTable("BookingRoomVariants")
            .AsInt32()
            .NotNullable();
    }
}