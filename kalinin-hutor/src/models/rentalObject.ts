import { RoomVariant } from "./roomVariant";

export interface RentalObject {
    // Идентификатор объекта аренды
    id?: string;
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

    roomVariants?: RoomVariant[];
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
        checkinDate?: string;
        //Время отъезда
        checkoutDate?: string;
        //Количество взрослых
        adultsCount?: number;
        //Количество детей
        childsCount?: number;
        //Количество комнат
        roomsCount?: number;

        selectedCharacteristicsIds?: string[];
    }

    export interface CreateRequest {
        name: string;
        description: string;
        address: string;
        landlordId?: string;
        checkinTime: string;
        checkoutTime: string;
        createRoomVariantsRequests?: RoomVariant.CreateRequest[];
    }

    export interface UpdateRequest {
        id: string;
        name: string;
        description: string;
        checkinTime: string;
        checkoutTime: string;
        createRoomVariantsRequests?: RoomVariant.CreateRequest[];
        updateRoomVariantsRequests?: RoomVariant.UpdateRequest[];
        deleteRoomVariantsRequest?: RoomVariant.DeleteRequest;
    }

    export interface DeleteRequest {
        ids: string[];
    }

    export const initial: RentalObject = {
        checkinTime: '12:00:00',
        checkoutTime: '12:00:00',
        description: '',
        address: '',
        landlordId: null,
        name: '',
        roomVariants: []
    }
}