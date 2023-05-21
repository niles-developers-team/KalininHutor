import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { AuthenticatedUser, User } from "../models";
import { sessionService } from "./sessionService";

class UserService {
    public async signin(request: User.SigninRequest): Promise<AuthenticatedUser> {
        return fetch('api/user/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public async signup(request: User.SignupRequest): Promise<AuthenticatedUser> {
        return fetch('api/user/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public signout() {
        sessionService.signOut();
    }

    public update(request: User.UpdateRequest): Promise<User> {
        return fetch('api/user/update', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleJsonResponse as ResponseHandler<User>);
    }

    public async get(query?: User.GetQuery): Promise<User[]> {
        let url = 'api/user';
        let conditionIndex: number = 0;
        if (query) {
            if (query.searchText !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}searchText=${query.searchText}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<User[]>);
    }

    public async getCurrentUser(): Promise<AuthenticatedUser> {
        let url = `api/user/me`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public async getDetails(id: string): Promise<User> {
        let url = `api/user/details?id=${id}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<User>);
    }

    public async delete(request: User.DeleteRequest): Promise<void> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(handleResponse);
    }
}

export const userService = new UserService();