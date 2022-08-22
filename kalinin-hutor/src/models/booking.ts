import { BookingRoomVariant } from "./bookingRoomVariant";
import { BookingStatuses, IEntity } from "./common";
import { RentalObject } from "./rentalObject";
import { User } from "./user";

export interface Booking extends IEntity {
    // Идентификатор брони
    id?: string;
    // Идентификатор объекта аренды
    rentalObjectId: string;
    readonly createdAt?: string;
    readonly status: BookingStatuses;
    readonly number: number;
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

    roomVariants: BookingRoomVariant[];
    tenant: User;
    rentalObject?: RentalObject;
}

export namespace Booking {
    // Очередь получения брони
    export interface GetQuery {
        // Идентификатор брони
        id?: string;
        // Идентификатор арендатора
        tenantId?: string;
        landlordId?: string;
        // Поисковая строка
        searchText?: string;
        // Дата заезда
        checkinDate?: string;
        // Дата отъезда
        checkoutDate?: string;
        onlyNotApproved?: boolean;
    }

    // Создает бронь, результатом выполнения является GUID
    export interface CreateRequest {
        tenant: User;
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
        bookingRooms: BookingRoomVariant.CreateRequest[];
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
}