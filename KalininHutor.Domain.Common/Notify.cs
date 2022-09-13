namespace KalininHutor.Domain;

///<summary> Уведомление </summary>
public class Notify : IEntity<Guid>
{
    ///<summary> Идентификатор  </summary>
    public Guid Id { get; protected set; }

    ///<summary> Идентификатор получателя </summary>
    public Guid UserId { get; protected set; }

    ///<summary> Тип уведомления </summary>
    public NotifyType Type { get; protected set; }

    ///<summary> Сообщение в уведомлении </summary>
    public string Message { get; protected set; } = string.Empty;

    ///<summary> Вариант уведомления </summary>
    public NotifyVariant Variant { get; protected set; }

    ///<summary> Время создания </summary>
    public DateTime CreatedAt { get; protected set; } = DateTime.Now;

    ///<summary> Прочитано ли уведомление получателем </summary>
    public bool Read { get; protected set; }

    protected Notify() { }

    public Notify(Guid userId, NotifyType type, string message, NotifyVariant variant)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Type = type;
        Message = message;
        Variant = variant;
    }
}