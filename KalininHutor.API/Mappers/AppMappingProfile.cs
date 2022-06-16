using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Queries;
using KalininHutor.DAL.Booking;
using KalininHutor.DAL.Identity;

namespace KalininHutor.API.Mappers;

using DomainRentalObject = Domain.Booking.RentalObject;
using DomainUser = Domain.Identity.User;

///<summary> Профайлер мапперов </summary>
public class AppMappingProfile : Profile
{

    ///<summary> Конструктор профайлера </summary>
    public AppMappingProfile()
    {
        CreateMap<DomainRentalObject, RentalObjectEntity>().ReverseMap();
        CreateMap<RentalObjectQueries.GetQuery, RentalObjectSearchOptions>().ReverseMap();
        CreateMap<RentalObjectEntity, RentalObjectDTO>();

        CreateMap<DomainUser, UserEntity>().ReverseMap();
        CreateMap<DomainUser, UserDetailsDTO>().ReverseMap();
        CreateMap<DomainUser, AuthenticatedUserDetailsDTO>().ReverseMap();
    }
}