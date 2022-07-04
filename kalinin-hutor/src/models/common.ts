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
    export function getDescription(value: BedTypes) {
        switch(value)
        {
            case BedTypes.BabyBed: return 'Детская кровать';
            case BedTypes.BigDouble: return 'Большая двуспальная кровать';
            case BedTypes.BigSingle: return 'Большая односпальная кровать';
            case BedTypes.Double: return 'Двуспальная кровать';
            case BedTypes.Single: return 'Односпальная кровать';
            default: return 'Неизвестный тип кровати'
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
        switch(value)
        {
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


export enum EntityStatus {
    NotChanged,
    Created,
    Updated,
    Deleted
}

export interface IEntity {
    status: EntityStatus;
}