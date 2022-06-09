namespace KalininHutor.DAL.Identity;
public class UserEntity
{
    private DateTime? _birthday;

    public Guid Id { get; protected set; }
    public string PhoneNumber { get; protected set; } = string.Empty;
    public byte[] Password { get; protected set; } = new byte[0];
    public string? Name { get; protected set; }
    public string? Lastname { get; protected set; }
    public string? Email { get; protected set; }
    public DateOnly? BirthDay { get => _birthday.HasValue ? DateOnly.FromDateTime(_birthday.Value) : null; protected set => _birthday = value.HasValue ? value.Value.ToDateTime(new TimeOnly()) : null; }
    public DateTime? BirthDayDateTime { get => _birthday; private set => _birthday = value; }
}

public class UserSearchOptions
{
    public string? SearchText { get; set; }
}
