namespace KalininHutor.API.DTO;

///<summary> Модель отображения объекта файла </summary>
public class FileObjectDTO
{
    ///<summary> Идентификатор файла </summary>
    public Guid Id { get; protected set; }
    ///<summary> Название </summary>
    public string Name { get; protected set; } = string.Empty;
    ///<summary> Расширение </summary>
    public string Extension { get; protected set; } = string.Empty;
    ///<summary> Данные </summary>
    public byte[] Body { get; protected set; } = new byte[0];
    ///<summary> Дата создания </summary>
    public DateTime CreatedAt { get; protected set; }
}