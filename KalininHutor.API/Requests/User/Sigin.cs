using System.ComponentModel.DataAnnotations;
using AutoMapper;
using KalininHutor.Domain.Identity;
using KalininHutor.DAL.Identity;
using MediatR;
using KalininHutor.API.Helpers;

namespace KalininHutor.API.Requests;

internal class UserSigninHandler : IRequestHandler<UserSigninRequest, string>
{
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly JWTHelper _jwtHelper;

    public UserSigninHandler(UserRepository userRepository, JWTHelper jwtHelper, IMapper mapper)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _jwtHelper = jwtHelper ?? throw new ArgumentNullException(nameof(jwtHelper));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<string> Handle(UserSigninRequest request, CancellationToken cancellationToken)
    {
        var user = _mapper.Map<User>(await _userRepository.Get(request.PhoneNumber));

        if (user == null)
            throw new ApplicationException("Не найден пользователь с таким номером телефона.");

        if (!user.VerifyPassword(request.Password))
            throw new ApplicationException("Неправильный пароль");

        return _jwtHelper.GenerateToken(user.Id);
    }
}

///<summary> Запрос на авторизацию пользователя </summary>
public class UserSigninRequest : IRequest<string>
{
    ///<summary> Номер телефона пользователя </summary>
    [Required]
    public string PhoneNumber { get; set; } = string.Empty;

    ///<summary> Пароль пользователя </summary>
    [Required]
    public string Password { get; set; } = string.Empty;
}