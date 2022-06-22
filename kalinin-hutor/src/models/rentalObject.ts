export interface RentalObject {
    // Идентификатор объекта аренды
    id: string | null;
    // Идентификатор владельца
    landlordId: string | null;
    // Название объекта аренды 
    name: string;
    // Описание объекта аренды
    description: string;
    address: string;
    // Время заезда объекта аренды
    checkinTime: string;
    // Время отъезда объекта аренды
    checkoutTime: string;
}

export namespace RentalObject {
    //Очередь получения объектов аренды
    export interface GetQuery {
        id?: string;
        // Идентификатор владельца
        landlordId?: string;
        //Строка поиска
        searchText?: string;
        //Время заезда
        checkinTime?: string;
        //Время отъезда
        checkoutTime?: string;
    }

    export interface CreateRequest {
        name: string;
        description: string;
        address: string;
        landlordId: string;
        checkinTime: string;
        checkoutTime: string;
    }

    export interface UpdateRequest {
        id: string;
        name: string;
        description: string;
        checkinTime: string;
        checkoutTime: string;
    }

    export interface DeleteRequest {
        id: string;
    }

    export const initial: RentalObject = {
        id: null,
        checkinTime: '12:00:00',
        checkoutTime: '12:00:00',
        description: '',
        address: '',
        landlordId: null,
        name: ''
    }
}