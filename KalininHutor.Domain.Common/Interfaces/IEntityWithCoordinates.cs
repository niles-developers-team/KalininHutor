namespace KalininHutor.Domain;

///<summary> Сущность с координатами </summary>
public interface IEntityWithCoordinates
{
    ///<summary> Координаты </summary>
    public Coordinates? Coordinates { get; }
}