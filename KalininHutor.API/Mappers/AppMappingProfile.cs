using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Requests;
using KalininHutor.DAL.Booking;
using KalininHutor.DAL.Identity;
using KalininHutor.Domain.Booking;
using KalininHutor.Domain.Identity;

namespace KalininHutor.API.Mappers;

///<summary> Профайлер мапперов </summary>
public class AppMappingProfile : Profile
{
    ///<summary> Конструктор профайлера </summary>
    public AppMappingProfile()
    {
        CreateMap<RentalObject, RentalObjectDTO>().ReverseMap();
        CreateMap<RentalObject, RentalObjectEntity>().ReverseMap();
        CreateMap<RentalObjectCommands.GetQuery, RentalObjectSearchOptions>().ReverseMap();
        CreateMap<RentalObjectEntity, RentalObjectDTO>();

        CreateMap<Booking, BookingDTO>()
            .ForMember(o => o.Tenant, o => o.MapFrom(b =>
                new UserDTO
                {
                    Name = b.TenantName,
                    Id = b.TenantId,
                    Email = b.TenantEmail,
                    Lastname = b.TenantLastname,
                    PhoneNumber = b.TenantPhone
                }
            )).ReverseMap();
        CreateMap<Booking, BookingEntity>().ReverseMap();
        CreateMap<BookingCommands.GetQuery, BookingSearchOptions>().ReverseMap();
        CreateMap<BookingEntity, BookingDTO>()
            .ForMember(o => o.Tenant, o => o.MapFrom(b =>
                new UserDTO
                {
                    Name = b.TenantName,
                    Id = b.TenantId,
                    Email = b.TenantEmail,
                    Lastname = b.TenantLastname,
                    PhoneNumber = b.TenantPhone
                }
            )).ReverseMap();

        CreateMap<User, UserEntity>().ReverseMap();
        CreateMap<User, UserDetailsDTO>().ReverseMap();
        CreateMap<UserEntity, UserDetailsDTO>().ReverseMap();
        CreateMap<User, AuthenticatedUserDetailsDTO>().ReverseMap();

        CreateMap<RoomCharacteristic, RoomCharacteristicDTO>().ReverseMap();
        CreateMap<RoomCharacteristicCommands.GetQuery, RoomCharacteristicSearchOptions>().ReverseMap();
        CreateMap<RoomCharacteristicDTO, RoomCharacteristicEntity>().ReverseMap();
        CreateMap<RoomCharacteristic, RoomCharacteristicEntity>().ReverseMap();

        CreateMap<RoomVariantDTO, RoomVariant>().ReverseMap();
        CreateMap<RoomVariantCommands.GetQuery, RoomVariantSearchOptions>().ReverseMap();
        CreateMap<RoomVariant, RoomVariantEntity>().ReverseMap();
        CreateMap<RoomVariantDTO, RoomVariantEntity>().ReverseMap();

        CreateMap<RoomVariantBedTypeDTO, RoomVariantBedType>().ReverseMap();
        CreateMap<RoomVariantBedType, RoomVariantBedTypeEntity>().ReverseMap();
        CreateMap<RoomVariantBedTypeDTO, RoomVariantBedTypeEntity>().ReverseMap();

        CreateMap<RoomVariantCharacteristicDTO, RoomVariantCharacteristic>().ReverseMap();
        CreateMap<RoomVariantCharacteristic, RoomVariantCharacteristicEntity>().ReverseMap();
        CreateMap<RoomVariantCharacteristicDTO, RoomVariantCharacteristicEntity>().ReverseMap();

        CreateMap<BookingRoomVariantCommands.CreateRequest, BookingRoomVariant>().ReverseMap();
        CreateMap<BookingRoomVariantEntity, BookingRoomVariant>().ReverseMap();
        CreateMap<BookingRoomVariantEntity, BookingRoomVariantDTO>().ReverseMap();
        CreateMap<BookingRoomVariant, BookingRoomVariantDTO>().ReverseMap();
    }
}