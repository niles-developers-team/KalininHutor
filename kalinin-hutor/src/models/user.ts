import { FileObject } from "./common";

export interface User {
    id?: string;
    phoneNumber: string;
    email?: string;
    name?: string;
    lastname?: string;
    birthday: string | null;
    avatar?: FileObject;
}

export interface AuthenticatedUser extends User {
    readonly token?: string;
}

export namespace User {
    export interface GetDetailsQuery {
        id: string;
    }
    export interface GetQuery {
        searchText: string;
    }

    export interface SigninRequest {
        phoneNumber: string;
        password: string;
        withSignup: true;
    }

    export interface SignupRequest {
        phoneNumber: string;
        password: string;
    }

    export interface UpdateRequest {
        id: string;
        phoneNumber: string;
        email?: string;
        name?: string;
        lastname?: string;
        birthday?: string;
        newAvatar?: FileObject;
        deleteAvatar?: boolean;
    }

    export interface DeleteRequest {
        id: string;
    }

    export const initial: User = {
        phoneNumber: '+7',
        birthday: null
    }
}