using System.Text.RegularExpressions;
using KalininHutor.Domain;

namespace KalininHutor.Domain.Identity;
public class User : IEntity<Guid>
{
    public Guid Id { get; protected set; }
    public string PhoneNumber { get; protected set; } = string.Empty;
    protected string? PasswordHash { get; set; }
    public string? Name { get; protected set; }
    public string? Lastname { get; protected set; }
    public string? Email { get; protected set; }
    public DateOnly? BirthDay { get; protected set; }

    protected User() { }
    public User(string phoneNumber, string password)
    {
        ValidatePhoneNumber(phoneNumber);

        ValidatePassword(password);

        Id = Guid.NewGuid();
        PhoneNumber = phoneNumber;
        PasswordHash = EncryptPassword(password);
    }

    public void SetInfo(string name, string lastname, string email, DateOnly birthday)
    {
        ValidateEmail(email);

        Name = name;
        Lastname = lastname;
        Email = email;
    }

    public string GenPassword()
    {
        var randomizer = new Random(Guid.NewGuid().GetHashCode());

        return randomizer.Next(10000, 100000).ToString();
    }

    public string EncryptPassword(string password) => BCrypt.Net.BCrypt.HashPassword(password);

    public bool VerifyPassword(string password) => BCrypt.Net.BCrypt.Verify(password, PasswordHash);

    public void ValidateEmail(string email)
    {
        var trimmedEmail = email.Trim();

        if (trimmedEmail.EndsWith('.'))
            throw new ArgumentException("Неправильный формат e-mail");

        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            if (addr.Address != trimmedEmail)
                throw new Exception();
        }
        catch
        {
            throw new ArgumentException("Неправильный формат e-mail");
        }
    }

    public void ValidatePassword(string password)
    {
        if (string.IsNullOrEmpty(password))
            throw new ArgumentNullException("Не указан пароль.");

        if (password.Length != 4 || !Regex.IsMatch(password, "/^([0-9]{5})$/g"))
            throw new ArgumentException("Неправильный формат пароля");
    }

    private void ValidatePhoneNumber(string phoneNumber)
    {
        if (string.IsNullOrEmpty(phoneNumber))
            throw new ArgumentNullException("Не указан номер телефона.");

        if (Regex.IsMatch(phoneNumber, @"/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/g"))
            throw new ArgumentException("Неверный формат номера телефона.");
    }
}
