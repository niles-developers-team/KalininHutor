import { CreateBookingRoomVariantRequest } from "./bookingRoomVariant";

export interface Booking
{
    // Идентификатор брони
    id: string;
    // Идентификатор арендатора
    tenantId: string;
    // Идентификатор объекта аренды
    rentalObjectId: string;
    // Количество взрослых
    adultCount: number;
    // Количество детей
    childCount: number;
    // Всего за бронь (руб.)
    total: number;
    // Дата заезда
    checkinDate: string;
    // Дата отъезда
    CheckoutDate: string
}

// Очередь получения брони
export interface GetBookingsQuery
{
    // Идентификатор брони
    id?: string;
    // Идентификатор арендатора
    tenantId?: string;
    // Поисковая строка
    searchText?: string;
    // Дата заезда
    checkinDate?: string;
    // Дата отъезда
    checkoutDate?: string;
}

// Создает бронь, результатом выполнения является GUID
export interface CreateBookingRequest
{
    // Идентификатор арендатора
    tenantId: string;
    // Идентификатор объекта аренды
    rentalObjectId: string;
    // Количество взрослых
    adultCount: number;
    // Количество детей
    childCount: number;
    // Дата заезда
    checkinDate: string;
    // Дата отъезда
    CheckoutDate: string

    // Коллекция бронируемых вариантов номеров
    bookingRooms: CreateBookingRoomVariantRequest[];
}

// Запрос удаления брони
export interface DeleteBookingRequest
{
    // Идентификатор брони
    id: string;
}

// Запрос обновления объекта аренды
export interface UpdateBookingRequest
{
    // Идентификатор брони
    id: string;
    // Количество взрослых
    adultCount: number;
    // Количество детей
    childCount: number;
    // Дата заезда
    checkinDate: string;
    // Дата отъезда
    CheckoutDate: string
}