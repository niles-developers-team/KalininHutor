import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { RoomCharacteristic } from "../models";

class RoomCharacteristicService {
    public async create(request: RoomCharacteristic.CreateRequest): Promise<RoomCharacteristic> {
        return fetch('api/roomCharacteristic', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<RoomCharacteristic>);
    }

    public async update(request: RoomCharacteristic.UpdateRequest): Promise<RoomCharacteristic> {
        return fetch('api/roomCharacteristic', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<RoomCharacteristic>);
    }

    public async get(query?: RoomCharacteristic.GetQuery): Promise<RoomCharacteristic[]> {
        let url = 'api/roomCharacteristic';
        let conditionIndex: number = 0;
        if (query) {
            if (query.searchText !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}searchText=${query.searchText}`;

            if(query.take !== undefined)
            url += `${conditionIndex++ === 0 ? '?' : '&'}take=${query.take}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<RoomCharacteristic[]>);
    }

    public async delete(request: RoomCharacteristic.DeleteRequest): Promise<void> {
        return fetch('api/roomCharacteristic', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleResponse);
    }
}

export const roomCharacteristicService = new RoomCharacteristicService();