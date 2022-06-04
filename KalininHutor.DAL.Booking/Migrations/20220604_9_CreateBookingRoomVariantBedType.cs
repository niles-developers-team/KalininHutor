using FluentMigrator;

namespace KalininHutor.DAL.Booking;

public class BookingRoomVariantBedType : ForwardOnlyMigration
{
    public override void Up()
    {        
        Create.Table("BookingRoomVariantBedTypes")
            .WithDescription("")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("BookingRoomVariant").AsGuid().ForeignKey("BookingRoomVariants", "Id").NotNullable().WithColumnDescription("Описание объекта аренды")
            .WithColumn("BedType").AsInt32().NotNullable().WithColumnDescription("Идентификатор владельца")
            .WithColumn("Count").AsInt32().NotNullable().WithColumnDescription("Название объекта аренды");
    }
}