using System.ComponentModel.DataAnnotations;
using AutoMapper;
using KalininHutor.DAL.Identity;
using MediatR;
using KalininHutor.API.Helpers;
using KalininHutor.API.DTO;
using KalininHutor.Domain.Identity;

namespace KalininHutor.API.Commands;

internal class UserSignupHandler : IRequestHandler<UserCommands.SignupRequest, AuthenticatedUserDetailsDTO>
{
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly JWTHelper _jwtHelper;

    public UserSignupHandler(UserRepository userRepository, JWTHelper jwtHelper, IMapper mapper)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _jwtHelper = jwtHelper ?? throw new ArgumentNullException(nameof(jwtHelper));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<AuthenticatedUserDetailsDTO> Handle(UserCommands.SignupRequest request, CancellationToken cancellationToken)
    {
        var existedUser = _mapper.Map<User>(await _userRepository.Get(request.PhoneNumber));

        if (existedUser != null)
            throw new ApplicationException("Пользователь с таким номером телефона уже существует.");

        var user = new User(request.PhoneNumber, request.Password);

        await _userRepository.Create(_mapper.Map<UserEntity>(user));

        var userDTO = _mapper.Map<AuthenticatedUserDetailsDTO>(user);
        userDTO.Token = _jwtHelper.GenerateToken(user.Id);

        return userDTO;
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Запрос на авторизацию пользователя </summary>
    public class SignupRequest : IRequest<AuthenticatedUserDetailsDTO>
    {
        ///<summary> Номер телефона пользователя </summary>
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        ///<summary> Пароль пользователя </summary>
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}