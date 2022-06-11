export interface RentalObject {
    // Идентификатор объекта аренды
    id: string;
    // Идентификатор владельца
    landlordId: string;
    // Название объекта аренды 
    name: string;
    // Описание объекта аренды
    description: string;
    // Время заезда объекта аренды
    checkinTime: string;
    // Время отъезда объекта аренды
    checkoutTime: string;
}

//Очередь получения объектов аренды
export interface GetRentalObjectsQuery
{
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

export interface CreateRentalObjectRequest {
    name: string;
    description: string;
    address: string;
    landlordId: string;
    checkinTime: string;
    checkoutTime: string;
}

export interface UpdateRentalObjectRequest {
    id: string;
    name: string;
    description: string;
    checkinTime: string;
    checkoutTime: string;
}

export interface DeleteRentalObjectRequest {
    id: string;
}