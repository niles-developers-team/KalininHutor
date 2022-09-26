namespace KalininHutor.API.DTO;

///<summary> Модель отображения объекта файла </summary>
public class FileObjectDTO
{
    ///<summary> Идентификатор файла </summary>
    public Guid Id { get; protected set; }
    ///<summary> Название </summary>
    public string Name { get; set; } = string.Empty;
    ///<summary> Расширение </summary>
    public string Extension { get; set; } = string.Empty;
    ///<summary> Данные </summary>
    public byte[] Body { get; set; } = new byte[0];
    ///<summary> Дата создания </summary>
    public DateTime CreatedAt { get; protected set; }

    ///<summary> Порядок сортировки </summary>
    public int SortOrder { get; protected set; }

    ///<summary> Идентификатор родителя </summary>
    public Guid ParentId { get; protected set; }
}