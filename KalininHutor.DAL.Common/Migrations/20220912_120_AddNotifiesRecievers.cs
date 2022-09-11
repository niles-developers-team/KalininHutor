using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220912_19)]
public class AddNotifiesRecievers : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("NotifiesRecievers")
            .WithDescription("Связь уведомление - пользователь")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор получателя уведомления")
            .WithColumn("UserId").AsGuid().ForeignKey("Users", "Id").NotNullable().WithColumnDescription("Идентификатор пользователя")
            .WithColumn("NotifyId").AsGuid().ForeignKey("Notifies", "Id").NotNullable().WithColumnDescription("Идентификатор уведомления");
    }
}