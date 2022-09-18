using KalininHutor.Domain;

namespace KalininHutor.API.DTO;

///<summary> Модель отображения уведомления пользователя </summary>
public class NotificationDTO
{
    ///<summary> Идентификатор уведомления </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор пользователя </summary>
    public Guid UserId { get; protected set; }
    ///<summary> Тип </summary>
    public NotifyType Type { get; protected set; }
    ///<summary> Текст </summary>
    public string Message { get; protected set; } = string.Empty;
    ///<summary> Вариант отображения </summary>
    public string Variant { get; protected set; } = NotifyVariant.Info.ToString().ToLower();
    ///<summary> Дата создания </summary>
    public DateTime CreatedAt { get; protected set; }
    ///<summary> Прочитан или нет </summary>
    public bool Read { get; protected set; }
}