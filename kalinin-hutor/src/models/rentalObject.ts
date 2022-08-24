import { IEntity } from "./common";
import { RoomVariant } from "./roomVariant";
import { User } from "./user";

export interface RentalObject extends IEntity {
    // Идентификатор объекта аренды
    id: string;
    // Название объекта аренды 
    name: string;
    // Описание объекта аренды
    description: string;
    address: string;
    // Время заезда объекта аренды
    checkinTime: string;
    // Время отъезда объекта аренды
    checkoutTime: string;

    landlord: User;

    bestDemand?: RentalObjectBestDemand;
    roomVariants?: RoomVariant[];
}

export interface RentalObjectBestDemand {
    rentalObjectId: string;
    adultsCount: string;
    childsCount: string;
    nightsCount: string;
    price: number;
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

        getBestDemands?: boolean;

        selectedCharacteristicsIds?: (string | undefined)[];
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
}