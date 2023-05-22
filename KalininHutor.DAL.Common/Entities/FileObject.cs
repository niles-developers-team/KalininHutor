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

    public string Body { get; protected set; } = string.Empty;

    ///<summary> Сжатые данные файла </summary>
    public byte[] CompressedBody { get; protected set; } = new byte[0];

    ///<summary> Дата создания </summary>
    public DateTime CreatedAt { get; protected set; }

    ///<summary> Порядок сортировки </summary>
    public int SortOrder { get; protected set; }

    ///<summary> Идентификатор родителя </summary>
    public Guid ParentId { get; protected set; }
}


public class FileObjectSearchOptions
{
    public List<Guid>? Ids { get; set; }
    public List<Guid>? ParentsIds { get; set; }
    public Guid? ParentId { get; set; }
}