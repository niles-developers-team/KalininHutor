namespace KalininHutor.DAL;

///<summary> Сущность с координатами </summary>
public interface IEntityWithCoordinates
{
    ///<summary> Широта </summary>
    float? Latitude { get; }
    ///<summary> Долгота </summary>
    float? Longitude { get; }
}