import { CharacteristicTypes } from "./common";

export interface RoomCharacteristic {
    // Идентификатор характеристики
    id: string;
    // Название характеристики
    name: string;
    // Описание харакетирстики
    description: string;
    // Тип (Зона) харакетистики
    type: CharacteristicTypes;
}

// Очередь получения удобств и услуг</summary>
export interface GetRoomCharacteristicsQuery
{
    // Идентификатор характеристики
    id: string;
    // Поисковая строка
    searchText: string;
}

export interface CreateRoomCharacteristicRequest {
    name: string;
    description: string;
    type: CharacteristicTypes;
}

export interface DeleteRoomCharacteristicRequest {
    id: string;
}

export interface UpdateRoomCharacteristicRequest 
    extends DeleteRoomCharacteristicRequest, CreateRoomCharacteristicRequest {
}