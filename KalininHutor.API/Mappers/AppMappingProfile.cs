using AutoMapper;
using KalininHutor.API.Queries;
using KalininHutor.DAL.Booking;

namespace KalininHutor.API.Mappers;

using DomainRentalObject = Domain.Booking.RentalObject;

///<summary> Профайлер мапперов </summary>
public class AppMappingProfile : Profile
{

    ///<summary> Конструктор профайлера </summary>
    public AppMappingProfile()
    {
        CreateMap<DomainRentalObject, RentalObjectEntity>().ReverseMap();
        CreateMap<RentalObject.GetQuery, RentalObjectSearchOptions>().ReverseMap();
        CreateMap<RentalObjectEntity, RentalObject.GetResponse>();
    }
}