using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.API.Helpers;
using KalininHutor.API.Requests;
using KalininHutor.DAL;
using KalininHutor.DAL.Booking;
using KalininHutor.DAL.Identity;
using KalininHutor.Domain;
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
        CreateMap<UserDTO, Tenant>().ReverseMap();
        CreateMap<UserDetailsDTO, Tenant>().ReverseMap();

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
        
        CreateMap<NotificationCommands.Create, Notification>().ReverseMap();
        CreateMap<NotificationCommands.Get, NotificationSearchOptions>().ReverseMap();
        CreateMap<NotificationEntity, Notification>().ReverseMap();
        CreateMap<NotificationEntity, NotificationDTO>().ForMember(o => o.Variant, o => o.MapFrom(s => Enum.Parse<NotifyVariant>(s.Variant).ToString().ToLower())).ReverseMap();
        CreateMap<Notification, NotificationDTO>().ForMember(o => o.Variant, o => o.MapFrom(s => s.Variant.ToString().ToLower())).ReverseMap();

        CreateMap<FileObjectEntity, FileObject>()
            .ForMember(o => o.Body, o => o.MapFrom(s => GZIP.Unzip(s.CompressedBody)))
            .ReverseMap().ForMember(o => o.CompressedBody, o => o.MapFrom(s => GZIP.Zip(s.Body)));
        CreateMap<FileObjectEntity, FileObjectDTO>()
            .ForMember(o => o.Body, o => o.MapFrom(s => GZIP.Unzip(s.CompressedBody)))
            .ReverseMap().ForMember(o => o.CompressedBody, o => o.MapFrom(s => GZIP.Zip(s.Body)));
        CreateMap<FileObject, FileObjectDTO>().ReverseMap();
    }
}