import { EntityStatus, IEntity } from "./common";
import { RoomVariantBedType } from "./roomVariantBedType";
import { RoomVariantCharacteristic } from "./roomVariantCharacteristic";

export enum PaymentOptions {
    // Можно оплатить онлайн 
    Online,
    // Оплата на месте только наличными 
    CashOnTheSpot,
    // Оплата на месте картой или наличными 
    ByCardOrCashOnTheSpot
}

export interface RoomVariant extends IEntity {
    // Идентификатор варинта номера объекта аренды
    id: string;
    // Идентификатор объекта аренды
    rentalObjectId: string;
    // Название
    name: string;
    // Описание
    description: string;
    // Цена
    price: number;
    // Ширина варианта номера
    width: number;
    // Длина варианта номера
    length: number;
    // Максимально человек в номере
    maxPersonsCount: number;
    // Период бесплатной отмены
    freeCancellationPeriod?: number;
    // Вариант оплаты
    paymentOption: PaymentOptions;
    // Всего номеров
    count: number;
    // Всего номеров свободно
    freeCount: number;

    characteristics: RoomVariantCharacteristic[];
    bedTypes: RoomVariantBedType[];
}

export namespace RoomVariant {
    //Очередь получения варинтов номеров
    export interface GetQuery {
        // Идентификатор варинта номера объекта аренды
        id?: string;
        // Идентификатор объекта аренды
        rentalObjectId?: string;
    }

    // Запрос на создание варианта номера
    export interface CreateRequest {
        // Идентификатор объекта аренды
        rentalObjectId?: string;
        // Название
        name: string;
        // Описание
        description: string;
        // Цена
        price: number;
        // Ширина варианта номера
        width: number;
        // Длина варианта номера
        length: number;
        // Максимально человек в номере
        maxPersonsCount: number;
        // Период бесплатной отмены
        freeCancellationPeriod?: number;
        // Вариант оплаты
        paymentOption: PaymentOptions;
        // Всего номеров
        count: number;
        // Всего номеров свободно
        freeCount: number;

        createBedTypesRequests: RoomVariantBedType.CreateRequest[];
        createCharacteristicsRequests: RoomVariantCharacteristic.CreateRequest[];
    }

    // Запрос удаления варинта номера
    export interface DeleteRequest {
        // Идентификатор варинта номера</summary>
        ids: string[];
    }

    // Запрос обновления варинта номера
    export interface UpdateRequest {
        // Идентификатор варинта номера объекта аренды
        id: string;
        // Название
        name: string;
        // Описание
        description: string;
        // Цена
        price: number;
        // Ширина варианта номера
        width: number;
        // Длина варианта номера
        length: number;
        // Максимально человек в номере
        maxPersonsCount: number;
        // Период бесплатной отмены
        freeCancellationPeriod?: number;
        // Вариант оплаты
        paymentOption: PaymentOptions;
        // Всего номеров
        count: number;
        // Всего номеров свободно
        freeCount: number;

        createBedTypesRequests: RoomVariantBedType.CreateRequest[];
        createCharacteristicsRequests: RoomVariantCharacteristic.CreateRequest[];

        updateBedTypesRequests: RoomVariantBedType.UpdateRequest[];
        updateCharacteristicsRequests: RoomVariantCharacteristic.UpdateRequest[];

        deleteBedTypesRequests: RoomVariantBedType.DeleteRequest;
        deleteCharacteristicsRequests: RoomVariantCharacteristic.DeleteRequest;
    }
}