namespace KalininHutor.DAL;

///<summary> Уведомление </summary>
public class NotifyEntity : IEntity<Guid>
{
    ///<summary> Идентификатор  </summary>
    public Guid Id { get; protected set; }

    ///<summary> Идентификатор получателя </summary>
    public Guid UserId { get; protected set; }

    ///<summary> Тип уведомления </summary>
    public int Type { get; protected set; }

    ///<summary> Сообщение в уведомлении </summary>
    public string Message { get; protected set; }

    ///<summary> Вариант уведомления </summary>
    public int Variant { get; protected set; }

    ///<summary> Время создания </summary>
    public DateTime CreatedAt { get; protected set; }

    ///<summary> Прочитано ли уведомление получателем </summary>
    public bool Read { get; protected set; }
}

public class NotifySearchOptions
{
    public Guid? UserId { get; protected set; }
}