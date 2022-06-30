import { BedTypes } from "./common";

export interface RoomVariantBedType {
    // Идентификатор варианта кровати
    id: string | null;
    // Идентификатор номера
    roomVariantId: string | null;
    // Тип кровати
    bedType: BedTypes;
    // Ширина кровати
    width?: number;
    // Длина кровати
    length?: number;
    // Максимально в комнате
    maxInRoom: number;
}

export namespace RoomVariantBedType {
    // Очередь получения вариантов кроватей в номере
    export interface GetQuery {
        // Идентификатор варианта кровати
        id: string;
        // Идентификатор номера
        roomVariantId: string;
    }

    // Запрос создания варианта кровати номера
    export interface CreateRequest {
        // Идентификатор номера
        roomVariantId: string | null;
        // Тип кровати
        bedType: BedTypes;
        // Ширина кровати
        width?: number;
        // Длина кровати
        length?: number;
        // Максимально в комнате
        maxInRoom: number;
    }

    // Запрос удаления варианта кровати в номере
    export interface DeleteRequest {
        // Идентификатор варианта кровати
        id: string;
    }

    // Запрос обновления варианта кровати
    export interface UpdateRequest {
        // Идентификатор варианта кровати
        id: string | null;
        // Тип кровати
        bedType: BedTypes;
        // Ширина кровати
        width?: number;
        // Длина кровати
        length?: number;
        // Максимально в комнате
        maxInRoom: number;
    }

    export const initial: RoomVariantBedType = {
        id: null,
        bedType: BedTypes.Single,
        maxInRoom: 0,
        roomVariantId: null
    }
}