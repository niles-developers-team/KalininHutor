import { BedTypes } from "./common";

export interface RoomVariantBedType {
    // Идентификатор варианта кровати
    id: string;
    // Идентификатор номера
    roomVariantId: string;
    // Тип кровати
    bedType: BedTypes;
    // Ширина кровати
    width?: number;
    // Длина кровати
    length?: number;
    // Максимально в комнате
    maxInRoom: number;
}

// Очередь получения вариантов кроватей в номере
export interface GetRoomVariantBedTypesQuery {
    // Идентификатор варианта кровати
    id: string;
    // Идентификатор номера
    roomVariantId: string;
}

// Запрос создания варианта кровати номера
export interface CreateRoomVariantBedTypeRequest {
    // Идентификатор номера
    roomVariantId: string;
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
export interface DeleteRoomVariantBedTypeRequest {
    // Идентификатор варианта кровати
    id: string;
}

// Запрос обновления варианта кровати
export interface UpdateRoomVariantBedTypeRequest {
    // Идентификатор варианта кровати
    id: string;
    // Тип кровати
    bedType: BedTypes;
    // Ширина кровати
    width?: number;
    // Длина кровати
    length?: number;
    // Максимально в комнате
    maxInRoom: number;
}