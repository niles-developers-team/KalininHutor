import { BedTypes, EntityStatus, IEntity } from "./common";

export interface RoomVariantBedType extends IEntity {
    // Идентификатор варианта кровати
    id?: string;
    // Идентификатор номера
    roomVariantId?: string;
    // Тип кровати
    bedType: BedTypes;
    // Ширина кровати
    width?: number;
    // Длина кровати
    length?: number;
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
        roomVariantId: string;
        // Тип кровати
        bedType: BedTypes;
        // Ширина кровати
        width?: number;
        // Длина кровати
        length?: number;
    }

    // Запрос удаления варианта кровати в номере
    export interface DeleteRequest {
        // Идентификатор варианта кровати
        ids: string[];
    }

    // Запрос обновления варианта кровати
    export interface UpdateRequest {
        // Идентификатор варианта кровати
        id: string;
        // Тип кровати
        bedType: BedTypes;
        // Ширина кровати
        width?: number;
        // Длина кровати
        length?: number;
    }

    export const initial: RoomVariantBedType = {
        bedType: BedTypes.Single,
        entityStatus: EntityStatus.NotChanged
    }
}