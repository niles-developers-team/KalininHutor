import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { RoomVariant } from "../models";

class RoomVariantService {
    public async create(request: RoomVariant.CreateRequest): Promise<RoomVariant> {
        return fetch('api/roomvariant', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<RoomVariant>);
    }

    public async update(request: RoomVariant.UpdateRequest): Promise<RoomVariant> {
        return fetch('api/roomvariant', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<RoomVariant>);
    }

    public async get(query?: RoomVariant.GetQuery): Promise<RoomVariant[]> {
        let url = 'api/roomvariant';
        let conditionIndex: number = 0;
        if (query) {
            if (query.rentalObjectId)
                url += `${conditionIndex++ === 0 ? '?' : '&'}rentalObjectId=${query.rentalObjectId}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<RoomVariant[]>);
    }

    public async delete(request: RoomVariant.DeleteRequest): Promise<void> {
        return fetch('api/roomvariant', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleResponse);
    }
}

export const roomVariantService = new RoomVariantService();