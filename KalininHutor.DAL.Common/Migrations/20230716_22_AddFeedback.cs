using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20230716_22)]
public class AddFeedback : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("Feedback")
        .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор отзыва")
        .WithColumn("FeedbackObjectId").AsGuid().ForeignKey("RentalObjects", "Id").NotNullable().WithColumnDescription("Идентификатор объекта отзыва")
        .WithColumn("Rate").AsInt16().NotNullable().WithColumnDescription("Оценка")
        .WithColumn("Comment").AsString().Nullable().WithColumnDescription("Коммент")
        .WithColumn("UserId").AsGuid().Nullable().WithColumnDescription("Идентификатор пользователя")
        .WithColumn("PhoneNumber").AsString().Nullable().WithColumnDescription("Номер телефона пользователя")
        .WithColumn("CreatedAt").AsDate().NotNullable().WithColumnDescription("Дата создания");
    }
}