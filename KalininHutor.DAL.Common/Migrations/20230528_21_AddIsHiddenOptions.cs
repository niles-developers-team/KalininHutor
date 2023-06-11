// using FluentMigrator;

// namespace KalininHutor.DAL.Migrations;

// [Migration(20230528_21)]
// public class AddIsHiddenOptions : ForwardOnlyMigration
// {
//     public override void Up()
//     {
//         Alter.Table("RentalObjects")
//         .AddColumn("IsHidden").AsBoolean().NotNullable().WithDefaultValue(false).WithColumnDescription("Объект аренды скрыт или нет?");
        
//         Alter.Table("RoomVariants")
//         .AddColumn("IsHidden").AsBoolean().NotNullable().WithDefaultValue(false).WithColumnDescription("Вариант номера скрыт или нет?");
//     }
// }