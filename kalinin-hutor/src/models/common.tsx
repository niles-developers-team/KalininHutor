import { namespace } from "stylis";

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

export interface Feedback extends IEntity {
    readonly id: string;
    feedbackObjectId: string;
    comment?: string;
    rate: number;
    userId?: string;
    phoneNumber?: string;
    createdAt: string;
}

export interface FileObject extends IEntity {
    readonly id: string;
    name: string;
    body: string;
    extension: string;
    sortOrder: number;
}

export namespace FileObject {
    
    // Очередь получения брони
    export interface GetQuery {        
        // Идентификатор брони
        parentId: string;
    }
}

/** Координаты */
export interface Coordinates {
    latitude: number;
    longitude: number;
}