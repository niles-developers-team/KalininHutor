using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Requests;
using KalininHutor.DAL.Booking;
using KalininHutor.DAL.Identity;

namespace KalininHutor.API.Mappers;

using DomainRoomCharacteristic = Domain.Booking.RoomCharacteristic;
using DomainRoomVariant = Domain.Booking.RoomVariant;
using DomainRoomVariantBedType = Domain.Booking.RoomVariantBedType;
using DomainRoomVariantCharacteristic = Domain.Booking.RoomVariantCharacteristic;
using DomainRentalObject = Domain.Booking.RentalObject;
using DomainUser = Domain.Identity.User;

///<summary> Профайлер мапперов </summary>
public class AppMappingProfile : Profile
{

    ///<summary> Конструктор профайлера </summary>
    public AppMappingProfile()
    {
        CreateMap<DomainRentalObject, RentalObjectDTO>().ReverseMap();
        CreateMap<DomainRentalObject, RentalObjectEntity>().ReverseMap();
        CreateMap<RentalObject.GetQuery, RentalObjectSearchOptions>().ReverseMap();
        CreateMap<RentalObjectEntity, RentalObjectDTO>();

        CreateMap<DomainUser, UserEntity>().ReverseMap();
        CreateMap<DomainUser, UserDetailsDTO>().ReverseMap();
        CreateMap<UserEntity, UserDetailsDTO>().ReverseMap();
        CreateMap<DomainUser, AuthenticatedUserDetailsDTO>().ReverseMap();

        CreateMap<DomainRoomCharacteristic, RoomCharacteristicDTO>().ReverseMap();
        CreateMap<RoomCharacteristic.GetQuery, RoomCharacteristicSearchOptions>().ReverseMap();
        CreateMap<RoomCharacteristicDTO, RoomCharacteristicEntity>().ReverseMap();
        CreateMap<DomainRoomCharacteristic, RoomCharacteristicEntity>().ReverseMap();

        CreateMap<RoomVariantDTO, DomainRoomVariant>().ReverseMap();
        CreateMap<RoomVariant.GetQuery, RoomVariantSearchOptions>().ReverseMap();
        CreateMap<DomainRoomVariant, RoomVariantEntity>().ReverseMap();
        CreateMap<RoomVariantDTO, RoomVariantEntity>().ReverseMap();

        CreateMap<RoomVariantBedTypeDTO, DomainRoomVariantBedType>().ReverseMap();
        CreateMap<DomainRoomVariantBedType, RoomVariantBedTypeEntity>().ReverseMap();
        CreateMap<RoomVariantBedTypeDTO, RoomVariantBedTypeEntity>().ReverseMap();

        CreateMap<RoomVariantCharacteristicDTO, DomainRoomVariantCharacteristic>().ReverseMap();
        CreateMap<DomainRoomVariantCharacteristic, RoomVariantCharacteristicEntity>().ReverseMap();
        CreateMap<RoomVariantCharacteristicDTO, RoomVariantCharacteristicEntity>().ReverseMap();
    }
}