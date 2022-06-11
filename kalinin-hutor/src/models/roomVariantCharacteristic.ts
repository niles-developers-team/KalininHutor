export interface RoomVariantCharacteristic {
    // Идентификатор характеристики номера
    id: string;
    // Идентификатор номера
    roomVariantId: string;
    // Идентификатор характеристики
    roomCharacteristicId: string;
    // Цена за услугу или удобство
    price?: number;
}

// Очередь получения характеристики варианта номера
export interface GetRoomVariantCharacteristicsQuery
{
    // Идентификатор характеристики номера
    id: string;
    // Идентификатор номера
    roomVariantId: string;
}

// Создает объект аренды, результатом выполнения является GUID
export interface CreateRoomVariantCharacteristicRequest
{
    // Идентификатор номера
    roomVariantId: string;
    // Идентификатор характеристики
    roomCharacteristicId: string;
    // Цена за услугу или удобство
    price?: number;
}
// Запрос удаления характеристики варианта номера
export interface DeleteRoomVariantCharacteristicRequest
{
    // Идентификатор характеристики номера
    id: string;
}
// Запрос обновления характеристики варианта номера
export interface UpdateRoomVariantCharacteristicRequest
{
    // Идентификатор характеристики номера
    id: string;
    // Цена за услугу или удобство
    price?: number;
}