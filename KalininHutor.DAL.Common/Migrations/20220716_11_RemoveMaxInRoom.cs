using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(2022071611)]
public class RemoveMaxInRooms : ForwardOnlyMigration
{
    public override void Up()
    {
        Delete.Column("MaxInRoom").FromTable("RoomVariantBedTypes");
    }
}