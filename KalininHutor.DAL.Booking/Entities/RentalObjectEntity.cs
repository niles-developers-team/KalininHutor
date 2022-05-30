namespace KalininHutor.DAL.Booking;

public class RentalObjectEntity
{
    public Guid Id { get; protected set; }
    public string Name { get; protected set; }
    public string Description { get; protected set; }
    public TimeOnly CheckinTime { get; protected set; }
    public TimeOnly CheckoutTime { get; protected set; }
}

public class RentalObjectSearchOptions
{
    public Guid Id { get; set; }
    public string SearchText { get; set; }
    public TimeOnly CheckinTime { get; set; }
    public TimeOnly CheckoutTime { get; set; }
}