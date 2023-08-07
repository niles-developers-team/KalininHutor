namespace KalininHutor.DAL.Identity;

/// <summary> Перечисление прав пользователя </summary>
public enum UsersRoles
{
    ///<summary> Пользователь </summary>
    User,
    ///<summary> Арендодатель </summary>
    Landlord,
    ///<summary> Продавец </summary>
    Seller,
    ///<summary> Администратор </summary>
    Admin
}

public class UserRoleEntity
{
    public Guid UserId { get; protected set; }
    public UsersRoles Role { get; protected set; }
}