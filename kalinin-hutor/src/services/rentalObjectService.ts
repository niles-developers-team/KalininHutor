import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { RentalObject } from "../models";

class RentalObjectService {
    public async create(request: RentalObject.CreateRequest): Promise<RentalObject> {
        return fetch('api/rentalobject', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<RentalObject>);
    }

    public async update(request: RentalObject.UpdateRequest): Promise<RentalObject> {
        return fetch('api/rentalobject', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<RentalObject>);
    }

    public async get(query?: RentalObject.GetQuery): Promise<RentalObject[]> {
        let url = 'api/rentalobject';
        let conditionIndex: number = 0;
        if (query) {
            if (query.searchText !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}searchText=${query.searchText}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<RentalObject[]>);
    }

    public async delete(request: RentalObject.DeleteRequest): Promise<void> {
        return fetch('api/rentalobject', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleResponse);
    }
}

export const rentalObjectService = new RentalObjectService();