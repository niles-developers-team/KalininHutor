export enum SnackbarVariant {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info'
}

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
     id?: number;
     ids?: number[];
     search?: string;
 }

 export interface StorageItem {
    token: string;
}