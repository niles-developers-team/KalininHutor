import { Accessible, Bathtub, Bed, Cancel, CheckCircle, CleaningServices, Crib, DriveFileRenameOutline, Fireplace, Hotel, HourglassBottom, Info, KingBed, LiveTv, LocalParking, NaturePeople, Panorama, RoomService, SingleBed, SoupKitchen, Weekend } from '@mui/icons-material';

export enum SnackbarVariant {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info'
}

export class UnauthorizedError extends Error { }

export class ApplicationError extends Error {
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

export interface Validation {
    isValid: boolean;
}

export namespace Validation {
    export const initial: Validation = { isValid: false };
}

export interface GetOptions {
    searchText?: string;
}

export interface StorageItem {
    token: string;
}

export enum BedTypes {
    // Односпальная кровать 
    Single,
    // Большая односпальная кровать 
    BigSingle,
    // Двуспальная кровать 
    Double,
    // Большая двуспальная кровать 
    BigDouble,
    // Детская кровать 
    BabyBed
}

export namespace BedTypes {
    export function getDescription(value: BedTypes | undefined) {
        switch (value) {
            case BedTypes.BabyBed: return 'Детская кровать';
            case BedTypes.BigDouble: return 'Большая двуспальная кровать';
            case BedTypes.BigSingle: return 'Большие односпальные кровати';
            case BedTypes.Double: return 'Двуспальная кровать';
            case BedTypes.Single: return 'Односпальные кровати';
            default: return 'Неизвестный тип кровати'
        }
    }

    export function getIcon(value: BedTypes | undefined): JSX.Element | null {
        switch (value) {
            case BedTypes.BabyBed: return <Crib />;
            case BedTypes.BigDouble: return <Bed />;
            case BedTypes.BigSingle: return <Weekend />;
            case BedTypes.Double: return <KingBed />;
            case BedTypes.Single: return <SingleBed />;
            default: return null;
        }
    }

    export const values: BedTypes[] = [
        BedTypes.Single,
        BedTypes.Double,
        BedTypes.BigSingle,
        BedTypes.BigDouble,
        BedTypes.BabyBed
    ];
}

export enum PaymentOptions {

    // Можно оплатить онлайн 
    Online,

    // Оплата на месте только наличными 
    CashOnTheSpot,

    // Оплата на месте картой или наличными 
    ByCardOrCashOnTheSpot
}

export enum CharacteristicTypes {
    // Спальня
    BedRoom,
    // Гостиная зона
    LivingArea,
    // Ванная комната
    WC,
    // Уборка и дезинфекция
    Cleaning,
    // Питание и напитки
    FoodAndDrinks,
    // Вид
    View,
    // Общие
    Common,
    // Парковка
    Parking,
    // Телевизоры и технологии
    TVAndMedia,
    // Удобства в номере
    AmenetiesInTheRoom,
    // Сервисы
    Services,
    // Доступность
    Availability,
    // На свежем воздухе
    Outdoors
}

export namespace CharacteristicTypes {
    export function getDescription(value: CharacteristicTypes | undefined) {
        switch (value) {
            case CharacteristicTypes.BedRoom: return 'Спальня';
            case CharacteristicTypes.LivingArea: return 'Гостиная зона';
            case CharacteristicTypes.WC: return 'Ванная комната';
            case CharacteristicTypes.Cleaning: return 'Уборка и дезинфекция';
            case CharacteristicTypes.FoodAndDrinks: return 'Питание и напитки';
            case CharacteristicTypes.View: return 'Вид';
            case CharacteristicTypes.Common: return 'Общие';
            case CharacteristicTypes.Parking: return 'Парковка';
            case CharacteristicTypes.TVAndMedia: return 'Телевизоры и технологии';
            case CharacteristicTypes.AmenetiesInTheRoom: return 'Удобства в номере';
            case CharacteristicTypes.Services: return 'Сервисы';
            case CharacteristicTypes.Availability: return 'Доступность';
            case CharacteristicTypes.Outdoors: return 'На свежем воздухе';
            default: return 'Неизвестный тип кровати'
        }
    }

    export function getIcon(value: CharacteristicTypes | undefined): JSX.Element | undefined {
        switch (value) {
            case CharacteristicTypes.BedRoom: return <Hotel />;
            case CharacteristicTypes.LivingArea: return <Fireplace />;
            case CharacteristicTypes.WC: return <Bathtub />;
            case CharacteristicTypes.Cleaning: return <CleaningServices />;
            case CharacteristicTypes.FoodAndDrinks: return <SoupKitchen />;
            case CharacteristicTypes.View: return <Panorama />;
            case CharacteristicTypes.Common: return <Info />;
            case CharacteristicTypes.Parking: return <LocalParking />;
            case CharacteristicTypes.TVAndMedia: return <LiveTv />;
            case CharacteristicTypes.AmenetiesInTheRoom: return <Weekend />;
            case CharacteristicTypes.Services: return <RoomService />;
            case CharacteristicTypes.Availability: return <Accessible />;
            case CharacteristicTypes.Outdoors: return <NaturePeople />;
            default: return undefined;
        }
    }

    export const values: CharacteristicTypes[] = [
        CharacteristicTypes.BedRoom,
        CharacteristicTypes.LivingArea,
        CharacteristicTypes.WC,
        CharacteristicTypes.Cleaning,
        CharacteristicTypes.FoodAndDrinks,
        CharacteristicTypes.View,
        CharacteristicTypes.Common,
        CharacteristicTypes.Parking,
        CharacteristicTypes.TVAndMedia,
        CharacteristicTypes.AmenetiesInTheRoom,
        CharacteristicTypes.Services,
        CharacteristicTypes.Availability,
        CharacteristicTypes.Outdoors
    ];
}

export enum BookingStatuses {    
    //Черновик
    Draft,
    //Новая бронь
    Created,
    //Бронь подтверждена
    Approved,
    //Бронь закрыта
    Closed,
    //Бронь отменена
    Rejected
}

export namespace BookingStatuses {
    export function getDescription(value: BookingStatuses) {
        switch (value) {
            case BookingStatuses.Draft: return 'Черновик';
            case BookingStatuses.Created: return 'Ожидает подтверждение';
            case BookingStatuses.Approved: return 'Бронь подтверждена';
            case BookingStatuses.Closed: return 'Бронь закрыта';
            case BookingStatuses.Rejected: return 'Питание и напитки';
            default: return 'Бронь отменена'
        }
    }

    export function getIcon(value: BookingStatuses): JSX.Element {
        switch (value) {
            case BookingStatuses.Draft: return <DriveFileRenameOutline color="disabled" />;
            case BookingStatuses.Created: return <HourglassBottom color="info" />;
            case BookingStatuses.Approved: return <CheckCircle color="success" />;
            case BookingStatuses.Closed: return <CheckCircle color="primary"/>;
            case BookingStatuses.Rejected: return <Cancel color="error"/>;
        }
    }

    export const values: BookingStatuses[] = [
        BookingStatuses.Draft,
        BookingStatuses.Created,
        BookingStatuses.Approved,
        BookingStatuses.Closed,
        BookingStatuses.Rejected
    ];
}

export enum EntityStatus {
    NotChanged,
    Draft,
    Created,
    Updated,
    Deleted
}

export interface IEntity {
    entityStatus: EntityStatus;
}