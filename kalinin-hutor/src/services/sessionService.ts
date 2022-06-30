import { StorageItem } from "../models";
import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";

class SessionService {
    private originalFetch: typeof fetch = fetch.bind(window);

    private readonly storageKey: string = 'kalinin_hutor_auth';
    private readonly noInit = {};
    private readonly cookies = new Cookies();

    public init(): void {
        this.mixSessionFetch();
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
        this.cookies.set(this.storageKey, JSON.stringify(storageItem));

        return true;
    }

    public signOut() {
        this.cookies.remove(this.storageKey);
    }

    private getStorageItem(): StorageItem {
        const storageValue: StorageItem = this.cookies.get(this.storageKey);
        if (!storageValue)
            return { token: '' };

        if (storageValue && !this.filterToken(storageValue.token)) {
            this.cookies.remove(this.storageKey);
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
                const prefixRegex = /^\/?api\//;
                const matches = prefixRegex.exec(input);

                if (matches && matches.length > 0) {
                    delete init["credentials"]; // we cant put this header because of CROS limitations
                    input = `https://localhost:7294/${input}`;
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