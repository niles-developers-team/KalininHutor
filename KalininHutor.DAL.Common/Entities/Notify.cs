namespace KalininHutor.DAL;

///<summary> Уведомление </summary>
public class NotifyEntity : IEntity<Guid>
{
    ///<summary> Идентификатор  </summary>
    public Guid Id { get; protected set; }

    ///<summary> Тип уведомления </summary>
    public int NotifyType { get; protected set; }

    ///<summary> Сообщение в уведомлении </summary>
    public string Message { get; protected set; }

    ///<summary> Вариант уведомления </summary>
    public int NotifyVariant { get; protected set; }
}

///<summary> Связь <see cref="Notify">Уведомление</see> - <see cref="User">Пользователь(получатель)</see> </summary>
public class NotifyRecieverEntity : IEntity<Guid>
{
    ///<summary> Идентификатор получателя уведомления </summary>
    public Guid Id { get; protected set; }
    ///<summary> Идентификатор пользователя </summary>
    public Guid UserId { get; protected set; }
    ///<summary> Идентификатор уведомления </summary>
    public Guid NotifyId { get; protected set; }
}