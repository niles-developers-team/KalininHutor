using AutoMapper;
using KalininHutor.API.Queries;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Mappers;

///<summary> Профайлер мапперов </summary>
public class AppMappingProfile : Profile
{
    ///<summary> Конструктор профайлера </summary>
    public AppMappingProfile()
    {
        CreateMap<RentalObject, RentalObjectEntity>().ReverseMap();
        CreateMap<GetRentalObjectsQuery, RentalObjectSearchOptions>().ReverseMap();
        CreateMap<RentalObjectEntity, GetRentalObjectResponse>();
    }
}