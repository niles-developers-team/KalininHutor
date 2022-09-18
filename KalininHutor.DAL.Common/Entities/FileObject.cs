namespace KalininHutor.DAL;

///<summary> Модель файла </summary>
public class FileObjectEntity : IEntity<Guid>
{
    ///<summary> Идентификатор </summary>
    public Guid Id { get; protected set; }

    ///<summary> Название </summary>
    public string Name { get; protected set; } = string.Empty;

    ///<summary> Расширение </summary>
    public string Extension { get; protected set; } = string.Empty;

    ///<summary> Сжатые данные файла </summary>
    public byte[] CompressedBody { get; protected set; } = new byte[0];

    ///<summary> Дата создания </summary>
    public DateTime CreatedAt { get; protected set; }
}


public class FileObjectSearchOptions
{
    public List<Guid> Ids { get; set; } = new List<Guid>();
}