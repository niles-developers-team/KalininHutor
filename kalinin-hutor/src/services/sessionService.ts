import { StorageItem } from "../models";
import jwt_decode from "jwt-decode";
import { cookiesService } from "./cookiesService";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

class SessionService {
    private originalFetch: typeof fetch = fetch.bind(window);

    public readonly apiUrl = process.env.REACT_APP_API_URL;
    private readonly storageKey: string = 'kalinin_hutor_auth';
    private readonly noInit = {};

    public init(): void {
        this.mixSessionFetch();
    }

    public initSignalR(): HubConnection | undefined {
        const storageItem = this.getStorageItem();

        if (!storageItem)
            return undefined;

        return new HubConnectionBuilder()
            .withUrl(`${this.apiUrl}/hubs/notifications`, { accessTokenFactory: () => storageItem.token })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
    }

    public isUserAuthenticated(): boolean {
        const storageValue = this.getStorageItem();
        return storageValue && Boolean(storageValue.token);
    }

    public signIn(token: string): boolean {
        const storageItem = this.getStorageItem();
        if (!this.filterToken(token))
            return false;

        storageItem.token = token;
        cookiesService.set(this.storageKey, storageItem);
        return true;
    }

    public signOut() {
        cookiesService.delete(this.storageKey);
    }

    private getStorageItem(): StorageItem {
        const storageValue: StorageItem = cookiesService.get(this.storageKey);
        if (!storageValue)
            return { token: '' };

        if (storageValue && !this.filterToken(storageValue.token)) {
            cookiesService.delete(this.storageKey);
        }
        return storageValue;
    }

    private mixSessionFetch() {
        window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
            const storageItem = this.getStorageItem();

            if (!init) {
                init = this.noInit;
            }

            const needCredentials = init.credentials === 'include';

            // TODO probably some day we will need to check same-origin here
            const needChangeInit = needCredentials;
            if (needChangeInit) {
                let headers = init.headers || this.noInit;
                const authenticationHeaders = needCredentials ?
                    { "Authorization": `Bearer ${storageItem.token}` } :
                    this.noInit;
                init = {
                    ...init,
                    headers: {
                        ...headers,
                        ...authenticationHeaders
                    }
                };
            }

            // Url correction in case we want to send a request to new api
            // TODO: Remove in future
            if (typeof input === "string") {
                const prefixRegex = /^\/?(api|hubs)\//;
                const matches = prefixRegex.exec(input);

                if (matches && matches.length > 0) {
                    delete init["credentials"]; // we cant put this header because of CROS limitations
                    input = `${this.apiUrl}/${input}`;
                }
            }

            return this.originalFetch(input, init);
        };
    }

    private filterToken(token: string): string {
        try {
            const tokenData = jwt_decode<any>(token);
            if (Date.now() >= tokenData.exp * 1000) {
                return '';
            }
            return token;
        } catch (error) {
            console.log(`Token validation error: ${error}`);
            return '';
        }
    }
}

export const sessionService = new SessionService();