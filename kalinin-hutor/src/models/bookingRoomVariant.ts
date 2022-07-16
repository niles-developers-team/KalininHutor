import { CreateBookingRoomVariantBedTypeRequest } from "./bookingRoomVariantBedType";

// Модель чтения выбранного варианта номера
export interface BookingRoomVariant
{
    // Идентификатор выбранного номера
    id?: string;
    // Идентификатор варианта номера
    roomVariantId?: string;
    // Идентификатор брони
    bookingId?: string;
    //Количество бронируемых номеров
    roomsCount: number;
    // Всего за номер (руб.)
    amount: number;
}

// Очередь получения забронированных вариантов кроватей в номера
export interface GetBookingRoomVariantsQuery
{
    // Идентификатор выбранного номера
    id: string;
    // Идентификатор брони
    bookingId: string;
}

// Запрос на создание выбранного варианта номера
export interface CreateBookingRoomVariantRequest
{
    // Идентификатор варианта номера
    roomVariantId: string;
    // Идентификатор брони
    bookingId: string;
    // Всего за номер (руб.)
    amount: number;

    // Выбранные типы кроватей
    bedTypes: CreateBookingRoomVariantBedTypeRequest[];
}

// Запрос удаления выбранного варианта номера
export interface DeleteBookingRoomVariantRequest
{
    // Идентификатор выбранного номера
    id: string;
}