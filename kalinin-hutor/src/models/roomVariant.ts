import { PaymentOptions } from "./common";
import { RoomVariantBedType } from "./roomVariantBedType";
import { RoomVariantCharacteristic } from "./roomVariantCharacteristic";

export interface RoomVariant {
    // Идентификатор варинта номера объекта аренды
    id: string | null;
    // Идентификатор объекта аренды
    rentalObjectId: string | null;
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
        rentalObjectId: string | null;
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
        id: string;
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
    }

    export const initial: RoomVariant = {
        count: 0,
        description: '',
        freeCount: 0,
        id: null,
        length: 0,
        maxPersonsCount: 0,
        name: '',
        paymentOption: PaymentOptions.CashOnTheSpot,
        price: 0,
        rentalObjectId: null,
        width: 0,
        bedTypes: [],
        characteristics: []
    }
}