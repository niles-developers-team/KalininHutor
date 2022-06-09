using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace KalininHutor.API.Helpers;

///<summary> JWT помощник </summary>
public class JWTHelper
{
    private readonly AppSettings _appSettings;

    ///<summary> Конструктор JWT помощник </summary>
    public JWTHelper(IOptions<AppSettings> appSettingsOptions)
    {
        _appSettings = appSettingsOptions == null ? throw new ArgumentNullException(nameof(appSettingsOptions)) : appSettingsOptions.Value;
    }
    
    ///<summary> </summary>
    public string GenerateToken(Guid userId)
    {
        // generate token that is valid for 7 days
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", userId.ToString()) }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}