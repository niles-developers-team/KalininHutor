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
            .WithColumn("UserId").AsGuid().ForeignKey("Users", "Id").NotNullable().WithColumnDescription("Идентификатор получателя")
            .WithColumn("Type").AsInt32().NotNullable().WithColumnDescription("Тип уведомления")
            .WithColumn("Message").AsString().NotNullable().WithColumnDescription("Сообщение в уведомлении")
            .WithColumn("Variant").AsInt32().NotNullable().WithColumnDescription("Вариант уведомления")
            .WithColumn("CreatedAt").AsDateTime().NotNullable().WithColumnDescription("Дата создания уведомления")
            .WithColumn("Read").AsBoolean().NotNullable().WithDefaultValue(false).WithColumnDescription("Прочитано ли уведомление получателем");
    }
}