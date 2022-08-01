// Модель чтения забронированных вариантов кроватей в номерах
export interface BookingBedType {
    // Идентификатор выбранной кровати в номер
    id: string;
    // Идентификатор выбранного номера
    bookingRoomVariantId: string;
    // Выбранный тип кровати
    bedTypeId: string;
    // Количество кроватей выбранного типа
    count: number;
}

export namespace BookingBedType {
    //Очередь получения забронированных вариантов кроватей в номерах
    export interface GetQuery {
        // Идентификатор выбранной кровати в номер
        id: string;
        // Идентификатор выбранного номера
        bookingRoomVariantId: string;
    }

    // Запрос на создание выбранной кровати в номере
    export interface CreateRequest {
        // Идентификатор выбранного номера
        bookingRoomVariantId: string;
        // Выбранный тип кровати
        bedTypeId: string;
        // Количество кроватей выбранного типа
        count: number;
    }

    // Запрос удаления выбранного варианта кровати
    export interface DeleteRequest {
        // Идентификатор выбранной кровати в номер
        id: string;
    }

}