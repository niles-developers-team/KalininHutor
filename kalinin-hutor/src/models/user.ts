export interface User {
    id: string;
    phoneNumber: string;
    email?: string;
    name?: string;
    lastname?: string;
    birthday: string;
}

export interface AuthenticatedUser extends User {
    token?: string;
}

export interface SigninRequest {
    phoneNumber: string;
    password: string;
}

export interface SignupRequest {
    phoneNumber: string;
    password: string;
}