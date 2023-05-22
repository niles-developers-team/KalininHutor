import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { NotificationCommands, Notification } from "../models";

class NotificationService {
    public async create(request: NotificationCommands.Create): Promise<Notification> {
        return fetch('api/notification', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<Notification>);
    }

    public async update(id: string): Promise<Notification> {
        return fetch('api/notification/mark-as-read', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id)
        })
            .then(handleJsonResponse as ResponseHandler<Notification>);
    }

    public async get(query?: NotificationCommands.Get): Promise<Notification[]> {
        let url = 'api/notification';
        let conditionIndex: number = 0;
        if (query) {
            if (query.status)
                url += `${conditionIndex++ === 0 ? '?' : '&'}status=${query.status}`;
            if (query.type)
                url += `${conditionIndex++ === 0 ? '?' : '&'}type=${query.type}`;
            if (query.variant)
                url += `${conditionIndex++ === 0 ? '?' : '&'}variant=${query.variant}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Notification[]>);
    }

    public async delete(ids: string[]): Promise<void> {
        return fetch('api/notification', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: ids })
        })
            .then(handleResponse);
    }
}

export const notificationService = new NotificationService();