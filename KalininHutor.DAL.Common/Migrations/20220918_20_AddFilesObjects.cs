using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(20220918_20)]
public class AddPhotos : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("FileObjects")
            .WithDescription("Таблица файлов")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор")
            .WithColumn("Name").AsString().NotNullable().WithColumnDescription("Название")
            .WithColumn("Extension").AsString().NotNullable().WithColumnDescription("Расширение")
            .WithColumn("CompressedBody").AsBinary().NotNullable().WithColumnDescription("Сжатые данные файла")
            .WithColumn("CreatedAt").AsDateTime().NotNullable().WithColumnDescription("Дата создания");
    }
}