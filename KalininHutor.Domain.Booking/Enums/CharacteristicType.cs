using System.ComponentModel;

namespace KalininHutor.Domain.Booking.Enums
{
    ///<summary> </summary>
    public enum CharacteristicTypes
    {
        [Description("Спальня")]
        ///<summary> Спальня </summary>
        BedRoom,

        [Description("Гостиная зона")]
        ///<summary> Гостиная зона </summary>
        LivingArea,

        [Description("Ванная комната")]
        ///<summary> Ванная комната </summary>
        WC,

        [Description("Уборка и дезинфекция")]
        ///<summary> Уборка и дезинфекция </summary>
        Cleaning,

        [Description("Питание и напитки")]
        ///<summary> Питание и напитки </summary>
        FoodAndDrinks,

        [Description("Вид")]
        ///<summary> Вид </summary>
        View,

        [Description("Общие")]
        ///<summary> Общие </summary>
        Common,

        [Description("Парковка")]
        ///<summary> Парковка </summary>
        Parking,

        [Description("Телевизоры и технологии")]
        ///<summary> Телевизоры и технологии </summary>
        TVAndMedia,

        [Description("Удобства в номере")]
        ///<summary> Удобства в номере </summary>
        AmenetiesInTheRoom,

        [Description("Сервисы")]
        ///<summary> Сервисы </summary>
        Services,

        [Description("Доступность")]
        ///<summary> Доступность </summary>
        Availability,
        
        [Description("На свежем воздухе")]
        ///<summary> На свежем воздухе </summary>
        Outdoors
    }
}