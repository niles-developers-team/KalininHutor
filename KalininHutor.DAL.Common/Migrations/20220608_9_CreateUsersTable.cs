using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206089)]
public class CreateUsersTable : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("Users")
            .WithDescription("Таблица пользователей")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор пользователя")
            .WithColumn("PhoneNumber").AsString().NotNullable().Unique().WithColumnDescription("Номер телефона пользователя")
            .WithColumn("Password").AsString().NotNullable().WithColumnDescription("Пароль пользователя")
            .WithColumn("Name").AsString().Nullable().WithColumnDescription("Имя пользователя")
            .WithColumn("Lastname").AsString().Nullable().WithColumnDescription("Фамилия пользователя")
            .WithColumn("Email").AsString().Nullable().WithColumnDescription("E-mail пользователя")
            .WithColumn("BirthDay").AsDate().Nullable().WithColumnDescription("Дата рождения пользователя");
    }
}