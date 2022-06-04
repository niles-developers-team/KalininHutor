namespace KalininHutor.DAL.Booking;

///<symmary> Вариант номера объекта аренды </summary>
public class RoomVariantEntity
{
    ///<symmary> Идентификатор варинта номера объекта аренды </summary>
    public Guid Id { get; protected set; }
    ///<symmary> Идентификатор объекта аренды </summary>
    public Guid RentalObjectId { get; protected set; }
    ///<symmary> Название </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<symmary> Описание </summary>
    public string Description { get; protected set; } = string.Empty;
    ///<symmary> Цена за взрослого </summary>
    public decimal PriceForAdult { get; protected set; }
    ///<symmary> Цена за ребёнка </summary>
    public decimal PriceForChild { get; protected set; }
    ///<symmary> Длина варианта номера </summary>
    public double Width { get; protected set; }
    ///<symmary> Ширина варианта номера </summary>
    public double Length { get; protected set; }
    ///<symmary> Максимально человек в номере </summary>
    public int MaxPersonsCount { get; protected set; }
    ///<symmary> Возможна ли бесплатная отмена? </summary>
    public bool IsFreeCancellationEnabled { get; protected set; }
    ///<symmary> Период бесплатной отмены </summary>
    public int? FreeCancellationPeriod { get; protected set; }
    ///<symmary> Вариант оплаты </summary>
    public int PaymentOption { get; protected set; }
    ///<symmary> Всего номеров </summary>
    public int Amount { get; protected set; }
    ///<symmary> Всего номеров свободно </summary>
    public int FreeAmount { get; protected set; }
}

public class RoomVariantSearchOptions
{
    public Guid? Id { get; set; }
    public Guid? RentalObjectId { get; set; }
}