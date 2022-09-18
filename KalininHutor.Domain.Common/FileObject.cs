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
    public byte[] Body { get; protected set; } = new byte[0];
    
    ///<summary> Дата создания </summary>
    public DateTime CreatedAt { get; protected set; }

    ///<summary> Закрытый конструктор для ORM </summary>
    protected FileObject() { }

    public FileObject(string name, string extension, byte[] body)
    {
        if(string.IsNullOrEmpty(name))
            throw new ArgumentNullException(nameof(name));

        if(string.IsNullOrEmpty(extension))
            throw new ArgumentNullException(nameof(extension));

        if(body == null || body.Length == 0)
            throw new ArgumentNullException(nameof(body));

        Name = name;
        Extension = extension;
        Body = body;
        CreatedAt = DateTime.Now;
    }
}
