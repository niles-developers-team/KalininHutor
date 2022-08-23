using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220820_18)]
public class AppendRoomsCount : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Column("RoomsCount")
            .OnTable("BookingRoomVariants")
            .AsInt32()
            .NotNullable()
            .WithDefaultValue(0)
            .WithColumnDescription("Количество забронированных комнат");
    }
}