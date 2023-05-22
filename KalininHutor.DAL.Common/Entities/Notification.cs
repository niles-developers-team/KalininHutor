namespace KalininHutor.DAL;

///<summary> Уведомление </summary>
public class NotificationEntity : IEntity<Guid>
{
    ///<summary> Идентификатор  </summary>
    public Guid Id { get; protected set; }

    ///<summary> Идентификатор получателя </summary>
    public Guid UserId { get; protected set; }

    ///<summary> Тип уведомления </summary>
    public int Type { get; protected set; }

    ///<summary> Сообщение в уведомлении </summary>
    public string Message { get; protected set; } = string.Empty;

    ///<summary> Вариант уведомления </summary>
    public string Variant { get; protected set; } = "Info";

    ///<summary> Время создания </summary>
    public DateTime CreatedAt { get; protected set; }

    ///<summary> Прочитано ли уведомление получателем </summary>
    public bool Read { get; protected set; }
}

public enum NotificationStatus
{
    All,
    OnlyRead,
    OnlyUnread
}

public class NotificationSearchOptions
{
    public Guid? UserId { get; set; }

    public NotificationStatus? Status { get; set; }

    public int? Type { get; set; }
}