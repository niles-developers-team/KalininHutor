using System.ComponentModel.DataAnnotations;
using AutoMapper;
using KalininHutor.DAL.Identity;
using MediatR;
using KalininHutor.API.Helpers;
using KalininHutor.API.DTO;
using KalininHutor.Domain.Identity;

namespace KalininHutor.API.Commands;

internal class UserSigninHandler : IRequestHandler<UserCommands.SigninRequest, AuthenticatedUserDetailsDTO>
{
    private readonly ISender _sender;
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly JWTHelper _jwtHelper;

    public UserSigninHandler(ISender sender, UserRepository userRepository, JWTHelper jwtHelper, IMapper mapper)
    {
        _sender = sender ?? throw new ArgumentNullException(nameof(sender));
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _jwtHelper = jwtHelper ?? throw new ArgumentNullException(nameof(jwtHelper));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<AuthenticatedUserDetailsDTO> Handle(UserCommands.SigninRequest request, CancellationToken cancellationToken)
    {
        var user = _mapper.Map<User>(await _userRepository.Get(request.PhoneNumber));

        if (user == null)
        {
            if (request.WithSignup)
            {
                return await _sender.Send(new UserCommands.SignupRequest
                {
                    Password = request.Password,
                    PhoneNumber = request.PhoneNumber
                });
            }
            else
                throw new ApplicationException("Не найден пользователь с таким номером телефона.");
        }

        if (!user.VerifyPassword(request.Password))
            throw new ApplicationException("Неправильный пароль");

        var userDTO = _mapper.Map<AuthenticatedUserDetailsDTO>(user);
        userDTO.Token = _jwtHelper.GenerateToken(user.Id);

        return userDTO;
    }
}

///<summary> Запросы и очереди пользователей </summary>
public partial class UserCommands
{
    ///<summary> Запрос на авторизацию пользователя </summary>
    public class SigninRequest : IRequest<AuthenticatedUserDetailsDTO>
    {
        ///<summary> Номер телефона пользователя </summary>
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        ///<summary> Пароль пользователя </summary>
        [Required]
        public string Password { get; set; } = string.Empty;

        ///<summary> Необходима ли регистрация? </summary>
        [Required]
        public bool WithSignup { get; set; } = false;
    }
}