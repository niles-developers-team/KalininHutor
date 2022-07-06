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
            if (query.landlordId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}landlordId=${query.landlordId}`;
            if (query.adultsCount !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}adultsCount=${query.adultsCount}`;
            if (query.childsCount !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}childsCount=${query.childsCount}`;
            if (query.roomsCount !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}roomsCount=${query.roomsCount}`;
            if (query.checkinDate !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}checkinTime=${query.checkinDate}`;
            if (query.checkoutDate !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}checkoutTime=${query.checkoutDate}`;
            if (query.id !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}id=${query.id}`;
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