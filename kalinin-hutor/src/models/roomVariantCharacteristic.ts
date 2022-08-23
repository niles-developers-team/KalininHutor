import { EntityStatus, IEntity } from "./common";
import { RoomCharacteristic } from "./roomCharacteristic";

export interface RoomVariantCharacteristic extends IEntity {
    // Идентификатор характеристики номера
    id: string | null;
    // Идентификатор номера
    roomVariantId: string | null;
    // Идентификатор характеристики
    roomCharacteristicId: string | null;
    roomCharacteristicName: string;
    // Цена за услугу или удобство
    price?: number;

    roomCharacteristic?: RoomCharacteristic;
}

export namespace RoomVariantCharacteristic {
    // Очередь получения характеристики варианта номера
    export interface GetQuery {
        // Идентификатор характеристики номера
        id: string;
        // Идентификатор номера
        roomVariantId: string;
    }

    // Создает объект аренды, результатом выполнения является GUID
    export interface CreateRequest {
        // Идентификатор номера
        roomVariantId: string | null;
        // Идентификатор характеристики
        roomCharacteristicId: string;
        // Цена за услугу или удобство
        price?: number;
    }
    // Запрос удаления характеристики варианта номера
    export interface DeleteRequest {
        // Идентификатор характеристики номера
        ids: string[];
    }
    // Запрос обновления характеристики варианта номера
    export interface UpdateRequest {
        // Идентификатор характеристики номера
        id: string;
        // Цена за услугу или удобство
        price?: number;
    }

    export const initial: RoomVariantCharacteristic = {
        id: null,
        roomCharacteristicId: null,
        roomCharacteristicName: '',
        roomVariantId: null,

        entityStatus: EntityStatus.NotChanged
    }
}