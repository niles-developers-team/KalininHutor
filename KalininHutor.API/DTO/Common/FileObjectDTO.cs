namespace KalininHutor.API.DTO;

///<summary> Модель отображения объекта файла </summary>
public class FileObjectDTO
{
    ///<summary> Идентификатор файла </summary>
    public Guid Id { get; set; }
    
    ///<summary> Название </summary>
    public string Name { get; set; } = string.Empty;

    ///<summary> Расширение </summary>
    public string Extension { get; set; } = string.Empty;

    ///<summary> Данные (строка base64) </summary>
    public byte[] Body { get; set; }

    ///<summary> Порядок сортировки </summary>
    public uint SortOrder { get; set; }

    ///<summary> Идентификатор родителя </summary>
    public Guid ParentId { get; set; }
}