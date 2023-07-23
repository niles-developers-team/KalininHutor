namespace KalininHutor.Domain;

///<summary> Координаты </summary>
public class Coordinates
{
    ///<summary> Широта </summary>
    public float Latitude { get; protected set; }
    ///<summary> Долгота </summary>
    public float Longitude { get; protected set; }

    protected Coordinates() {}

    /// <summary> Конструктор координат </summary>
    /// <param name="latitude">Широта</param>
    /// <param name="longitude">Долгота</param>
    public Coordinates(float latitude, float longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }
}