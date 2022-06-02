using FluentMigrator;

namespace KalininHutor.DAL.Migrations;

[Migration(202206021)]
public class CreateRentalObjectTable : ForwardOnlyMigration
{
    public override void Up()
    {
        var tableName = "RentalObjects";

        Create.Table(tableName)
            .WithDescription("Таблица объектов аренды")
            .WithColumn("Id").AsGuid().PrimaryKey().NotNullable().Unique().WithColumnDescription("Идентификатор объекта аренды")
            .WithColumn("OwnerId").AsGuid().NotNullable().WithColumnDescription("Идентификатор владельца")
            .WithColumn("Name").AsString().NotNullable().WithColumnDescription("Название объекта аренды")
            .WithColumn("Description").AsString().NotNullable().WithColumnDescription("Описание объекта аренды")
            .WithColumn("CheckinTime").AsTime().NotNullable().WithColumnDescription("Время заезда")
            .WithColumn("CheckoutTime").AsTime().NotNullable().WithColumnDescription("Время отъезда");


            // create table RentalObjects (
            //     Id uuid primary key,
            //     OwnerId uuid not null,
            //     Name varchar(100) not null,
            //     Description text not null,
            //     CheckinTime time not null,
            //     CheckoutTime time not null
            // );

            // comment on table RentalObjects is 'Таблица объектов аренды';

            // comment on column RentalObjects.Id is 'Идентификатор объекта аренды';
            // comment on column RentalObjects.OwnerId is 'Идентификатор владельца';
            // comment on column RentalObjects.Name is 'Название объекта аренды';
            // comment on column RentalObjects.Description is 'Описание объекта аренды';
            // comment on column RentalObjects.CheckinTime is 'Время заезда';
            // comment on column RentalObjects.CheckoutTime is 'Время отъезда';
    }
}