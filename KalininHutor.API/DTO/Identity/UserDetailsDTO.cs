namespace KalininHutor.API.DTO;

///<summary> Модель отображения данных пользователя </summary>
public class UserDTO
{
    ///<summary> Идентификатор пользователя </summary>
    public Guid? Id { get; set; }
    ///<summary> Номер телефона </summary>
    public string PhoneNumber { get; set; } = string.Empty;
    ///<summary> Имя </summary>
    public string? Name { get; set; }
    ///<summary> Фамилия </summary>
    public string? Lastname { get; set; }
    ///<summary> E-mail </summary>
    public string? Email { get; set; }
}

///<summary> Модель чтения деталей пользователя </summary>
public class UserDetailsDTO : UserDTO
{
    ///<summary>Идентификатор пользователя</summary>
    public new Guid Id { get; set; }
    ///<summary> Дата рождения </summary>
    public DateOnly? Birthday { get; set; }

    ///<summary> Аватар пользователя </summary>
    public FileObjectDTO? Avatar { get; set; }

    ///<summary> Уведомления пользователя </summary>
    public IEnumerable<NotificationDTO>? Notifications { get; set; }
}

///<summary> Пользователь подключенный к хабу </summary>
public class HubUser
{
    ///<summary> Идентфикатор пользователя </summary>
    public Guid Id { get; set; }
    ///<summary> Идентификаторы подключений пользователя </summary>
    public HashSet<string>? ConnectionIds { get; set; }
}

///<summary> Модель чтения аутентифицированного пользователя </summary>
public class AuthenticatedUserDetailsDTO : UserDetailsDTO
{
    ///<summary> Токен аутентификации </summary>
    public string? Token { get; set; }
}