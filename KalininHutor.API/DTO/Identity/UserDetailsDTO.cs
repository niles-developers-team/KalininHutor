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
}

public class HubUser
{
    public Guid Id { get; set; }
    public HashSet<string> ConnectionIds { get; set; }
}

///<summary> Модель чтения аутентифицированного пользователя </summary>
public class AuthenticatedUserDetailsDTO : UserDetailsDTO
{
    ///<summary> Токен аутентификации </summary>
    public string? Token { get; set; }
}