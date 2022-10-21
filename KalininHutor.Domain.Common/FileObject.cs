namespace KalininHutor.Domain;

///<summary> Модель файла </summary>
public class FileObject : IEntity<Guid>
{
    ///<summary> Идентификатор </summary>
    public Guid Id { get; protected set; }

    ///<summary> Название </summary>
    public string Name { get; protected set; } = string.Empty;

    ///<summary> Расширение </summary>
    public string Extension { get; protected set; } = string.Empty;

    ///<summary> Данные файла </summary>
    public string Body { get; protected set; } = string.Empty;

    ///<summary> Дата создания </summary>
    public DateTime CreatedAt { get; protected set; }

    ///<summary> Порядок сортировки </summary>
    public uint SortOrder { get; protected set; }

    ///<summary> Идентификатор родителя </summary>
    public Guid ParentId { get; protected set; }

    ///<summary> Закрытый конструктор для ORM </summary>
    protected FileObject() { }

    public FileObject(string name, string extension, string body, uint sortOrder, Guid parentId)
    {
        if (string.IsNullOrEmpty(name))
            throw new ArgumentNullException(nameof(name));

        if (string.IsNullOrEmpty(extension))
            throw new ArgumentNullException(nameof(extension));

        if (body == null || body.Length == 0)
            throw new ArgumentNullException(nameof(body));

        if (parentId == Guid.Empty)
            throw new ArgumentException("Неправильно указан родитель");

        Id = Guid.NewGuid();
        CreatedAt = DateTime.Now;

        Name = name;
        Extension = extension;
        Body = body;
        CreatedAt = DateTime.Now;
        SortOrder = sortOrder;
        ParentId = parentId;
    }
}
