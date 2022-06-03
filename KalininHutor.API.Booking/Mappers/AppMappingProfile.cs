using AutoMapper;
using KalininHutor.API.Booking.Queries;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking;

namespace KalininHutor.API.Booking.Mappers;

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