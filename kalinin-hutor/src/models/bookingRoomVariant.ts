import { BedTypes } from ".";

// Модель чтения выбранного варианта номера
export interface BookingRoomVariant {
    // Идентификатор выбранного номера
    id?: string;
    // Идентификатор варианта номера
    roomVariantId: string;
    // Идентификатор брони
    bookingId?: string;
    //Количество бронируемых номеров
    roomsCount: number;
    //Цена за номер
    price: number;
    // Всего за номер (руб.)
    amount: number;
    //Выбранный тип кровати
    bedType: BedTypes;
}

export namespace BookingRoomVariant {
    // Очередь получения забронированных вариантов кроватей в номера
    export interface GetQuery {
        // Идентификатор выбранного номера
        id: string;
        // Идентификатор брони
        bookingId: string;
    }

    // Запрос на создание выбранного варианта номера
    export interface CreateRequest {
        // Идентификатор варианта номера
        roomVariantId: string;
        // Идентификатор брони
        bookingId?: string;
        // Всего за номер (руб.)
        amount: number;

        // Выбранные типы кроватей
        bedType: BedTypes;
    }

    // Запрос удаления выбранного варианта номера
    export interface DeleteRequest {
        // Идентификатор выбранного номера
        id: string;
    }
}