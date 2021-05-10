export class LocalStorageHelper {
    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    setToken(accessToken: string): void {
        localStorage.setItem('accessToken', accessToken);
    }

    removeToken(): void {
        localStorage.removeItem('accessToken');
    }
}
