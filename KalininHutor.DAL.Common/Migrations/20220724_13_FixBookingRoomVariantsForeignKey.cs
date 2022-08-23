using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220724_13)]
public class FixBookingRoomVariantsForeignKey : ForwardOnlyMigration
{
    public override void Up()
    {
        Delete.ForeignKey("fk_bookingroomvariants_roomvariantid_rentalobjects_id")
            .OnTable("BookingRoomVariants");

        Create.ForeignKey("fk_bookingroomvariants_roomvariantid_roomvariants_id")
            .FromTable("BookingRoomVariants")
            .ForeignColumn("RoomVariantId")
            .ToTable("RoomVariants")
            .PrimaryColumn("Id");
    }
}