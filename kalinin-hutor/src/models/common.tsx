export class UnauthorizedError extends Error { }

export class ApplicationError extends Error {
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

export interface Validation {
    isValid: boolean;
}

export namespace Validation {
    export const initial: Validation = { isValid: false };
}

export interface GetOptions {
    searchText?: string;
}

export interface StorageItem {
    token: string;
}

export enum EntityStatus {
    NotChanged,
    Draft,
    Updated,
    Deleted
}

export interface IEntity {
    entityStatus: EntityStatus;
}

export interface FileObject extends IEntity {
    readonly id?: string;
    name: string;
    body: string;
    extension: string;
    order: number;
}