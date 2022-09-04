import { DriveFileRenameOutline, HourglassBottom, CheckCircle, Cancel } from "@mui/icons-material";
import { BookingRoomVariant, RentalObject, User } from ".";
import { IEntity } from "./common";

export interface Booking extends IEntity {
    // Идентификатор брони
    id?: string;
    // Идентификатор объекта аренды
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
    rentalObject: RentalObject;
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