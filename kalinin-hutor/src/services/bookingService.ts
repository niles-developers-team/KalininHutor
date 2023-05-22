import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { Booking } from "../models";

class BookingService {
    public async create(request: Booking.CreateRequest): Promise<Booking> {
        return fetch('api/booking', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<Booking>);
    }

    public async update(request: Booking.UpdateRequest): Promise<void> {
        return fetch('api/booking', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<void>);
    }

    public async approveBooking(id: string): Promise<void> {
        return fetch(`api/booking/approve?bookingId=${id}`, {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(handleJsonResponse as ResponseHandler<void>);
    }

    public async get(query?: Booking.GetQuery): Promise<Booking[]> {
        let url = 'api/booking';
        let conditionIndex: number = 0;
        if (query) {
            if (query.searchText)
                url += `${conditionIndex++ === 0 ? '?' : '&'}searchText=${query.searchText}`;
            if (query.tenantId)
                url += `${conditionIndex++ === 0 ? '?' : '&'}tenantId=${query.tenantId}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Booking[]>);
    }

    public async getLandlordBookings(landlordId: string, onlyNotApproved: boolean): Promise<Booking[]> {
        let url = `api/booking/landlord-bookings?landlordId=${landlordId}&onlyNotApproved=${onlyNotApproved}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Booking[]>);
    }

    public async delete(request: Booking.DeleteRequest): Promise<void> {
        return fetch('api/booking', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleResponse);
    }
}

export const bookingService = new BookingService();