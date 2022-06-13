import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { AuthenticatedUser, User } from "../models";
import { sessionService } from "./sessionService";

class UserService {
    public async signin(options: User.SigninRequest): Promise<AuthenticatedUser> {
        return fetch('api/user/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public async signup(options: User.SignupRequest): Promise<AuthenticatedUser> {
        return fetch('api/user/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public signout() {
        sessionService.signOut();
    }

    public async update(user: User): Promise<User> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(handleJsonResponse as ResponseHandler<User>);
    }

    public async get(options?: User.GetQuery): Promise<User[]> {
        let url = 'api/user';
        let conditionIndex: number = 0;
        if (options) {
            if (options.searchText !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}searchText=${options.searchText}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<User[]>);
    }

    public async getDetails(id: string): Promise<User> {
        let url = `api/user/details?id=${id}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<User>);
    }

    public async delete(id: string): Promise<void> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id)
        })
            .then(handleResponse);
    }
}

export const userService = new UserService();