import moment from "moment";
import { BookingRoomVariant, CreateBookingRoomVariantRequest } from "./bookingRoomVariant";
import { EntityStatus, IEntity } from "./common";

export interface Booking extends IEntity {
    // Идентификатор брони
    id?: string;
    // Идентификатор арендатора
    tenantId?: string;
    // Идентификатор объекта аренды
    rentalObjectId?: string;
    // Количество взрослых
    adultCount: number;
    // Количество детей
    childCount: number;
    // Всего за бронь (руб.)
    readonly total: number;
    // Дата заезда
    checkinDate: string;
    // Дата отъезда
    checkoutDate: string

    roomVariants?: BookingRoomVariant[];
}

export namespace Booking {
    // Очередь получения брони
    export interface GetQuery {
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
    export interface CreateRequest {
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
        checkoutDate: string

        // Коллекция бронируемых вариантов номеров
        bookingRooms: CreateBookingRoomVariantRequest[];
    }

    // Запрос удаления брони
    export interface DeleteRequest {
        // Идентификатор брони
        id: string;
    }

    // Запрос обновления объекта аренды
    export interface UpdateRequest {
        // Идентификатор брони
        id: string;
        // Количество взрослых
        adultCount: number;
        // Количество детей
        childCount: number;
        // Дата заезда
        checkinDate: string;
        // Дата отъезда
        checkoutDate: string
    }

    export const initial: Booking = {
        adultCount: 0,
        checkinDate: moment().toISOString(),
        checkoutDate: moment().add(7, 'days').toISOString(),
        childCount: 0,
        total: 0,
        status: EntityStatus.NotChanged,

        roomVariants: []
    }
}