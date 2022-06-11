import { PaymentOptions } from "./common";

export interface RoomVariant {    
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
}

//Очередь получения варинтов номеров
export interface GetRoomVariantQuery
{
    // Идентификатор варинта номера объекта аренды
    id: string;
    // Идентификатор объекта аренды
    rentalObjectId: string;
}

// Запрос на создание варианта номера
export interface CreateRoomVariantRequest {    
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
}

// Запрос удаления варинта номера
export interface DeleteRoomVariantRequest {
    // Идентификатор варинта номера</summary>
    id: string;
}

// Запрос обновления варинта номера
export interface UpdateRoomVariantRequest
{
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