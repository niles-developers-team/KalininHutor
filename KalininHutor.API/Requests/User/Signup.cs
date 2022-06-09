using System.ComponentModel.DataAnnotations;
using AutoMapper;
using KalininHutor.Domain.Identity;
using KalininHutor.DAL.Identity;
using MediatR;
using KalininHutor.API.Helpers;

namespace KalininHutor.API.Requests;

internal class SignupHandler : IRequestHandler<SignupRequest, string>
{
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly JWTHelper _jwtHelper;

    public SignupHandler(UserRepository userRepository, JWTHelper jwtHelper, IMapper mapper)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _jwtHelper = jwtHelper ?? throw new ArgumentNullException(nameof(jwtHelper));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<string> Handle(SignupRequest request, CancellationToken cancellationToken)
    {
        var existedUser = _mapper.Map<User>(await _userRepository.Get(request.PhoneNumber));

        if (existedUser != null)
            throw new ApplicationException("Пользователь с таким номером телефона уже существует.");

        var user = new User(request.PhoneNumber, request.Password);

        await _userRepository.Create(_mapper.Map<UserEntity>(user));

        return _jwtHelper.GenerateToken(user.Id);
    }
}

///<summary> Запрос на авторизацию пользователя </summary>
public class SignupRequest : IRequest<string>
{
    ///<summary> Номер телефона пользователя </summary>
    [Required]
    public string PhoneNumber { get; protected set; } = string.Empty;

    ///<summary> Пароль пользователя </summary>
    [Required]
    public string Password { get; protected set; } = string.Empty;
}