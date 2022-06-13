export interface User {
    id: string | null;
    phoneNumber: string;
    email?: string;
    name?: string;
    lastname?: string;
    birthday: string | null;
}

export interface AuthenticatedUser extends User {
    token?: string;
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
    }
    
    export interface SignupRequest {
        phoneNumber: string;
        password: string;
    }

    export const initial: User = {
        id: null,
        phoneNumber: '+7',
        birthday: null
    }
}