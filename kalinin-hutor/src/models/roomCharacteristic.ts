import { CharacteristicTypes } from "./common";

export interface RoomCharacteristic {
    // Идентификатор характеристики
    id?: string;
    // Название характеристики
    name: string;
    // Описание харакетирстики
    description: string;
    // Тип (Зона) харакетистики
    type: CharacteristicTypes;
}

export interface RoomCharacteristicFilter extends RoomCharacteristic {
    selected?: boolean;
}

export namespace RoomCharacteristic {
    // Очередь получения удобств и услуг</summary>
    export interface GetQuery {
        // Идентификатор характеристики
        id?: string;
        // Поисковая строка
        searchText?: string;
        take?: number;
    }

    export interface CreateRequest {
        name: string;
        description: string;
        type: CharacteristicTypes;
    }

    export interface DeleteRequest {
        id: string;
    }

    export interface UpdateRequest
        extends DeleteRequest, CreateRequest {
    }

    export const initial: RoomCharacteristic = {
        description: '',
        name: '',
        type: CharacteristicTypes.Common
    }
}