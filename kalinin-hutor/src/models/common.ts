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