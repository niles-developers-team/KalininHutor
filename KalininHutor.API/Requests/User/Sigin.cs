using System.ComponentModel.DataAnnotations;
using AutoMapper;
using KalininHutor.DAL.Identity;
using MediatR;
using KalininHutor.API.Helpers;

namespace KalininHutor.API.Requests;

using DomainUser = Domain.Identity.User;

internal class UserSigninHandler : IRequestHandler<User.SigninRequest, string>
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

    public async Task<string> Handle(User.SigninRequest request, CancellationToken cancellationToken)
    {
        var user = _mapper.Map<DomainUser>(await _userRepository.Get(request.PhoneNumber));

        if (user == null)
            throw new ApplicationException("Не найден пользователь с таким номером телефона.");

        if (!user.VerifyPassword(request.Password))
            throw new ApplicationException("Неправильный пароль");

        return _jwtHelper.GenerateToken(user.Id);
    }
}

public partial class User
{
    ///<summary> Запрос на авторизацию пользователя </summary>
    public class SigninRequest : IRequest<string>
    {
        ///<summary> Номер телефона пользователя </summary>
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        ///<summary> Пароль пользователя </summary>
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}