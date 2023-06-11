import Cookies from "universal-cookie";

class CookiesService {
    private readonly cookies = new Cookies();
    public get<T>(name: string): T { return this.cookies.get(name); }
    public set<T>(name: string, value: T): void {
        if (!value)
            this.delete(name);
        this.cookies.set(name, JSON.stringify(value));
    }
    public delete(name: string): void { this.cookies.remove(name); }
}
export const cookiesService = new CookiesService();


class LocalStorageService {
    public get<T>(name: string): T {
        const item = localStorage.getItem(name);
        return item != null && JSON.parse(item);
    }
    public set<T>(name: string, value: T): void {
        if (!value) {
            localStorage.removeItem(name);
            return;
        }
        localStorage.setItem(name, JSON.stringify(value));
    }
    public delete(name: string): void { localStorage.remove(name); }
}
export const localStorageService = new LocalStorageService();