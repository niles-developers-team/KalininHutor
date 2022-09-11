using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220912_19)]
public class AddNotifies : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("Notifies")
            .WithDescription("Таблица уведомления")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор уведомления")
            .WithColumn("NotifyType").AsInt32().NotNullable().WithColumnDescription("Тип уведомления")
            .WithColumn("Message").AsString().NotNullable().WithColumnDescription("Сообщение в уведомлении")
            .WithColumn("NotifyVariant").AsInt32().NotNullable().WithColumnDescription("Вариант уведомления");
    }
}