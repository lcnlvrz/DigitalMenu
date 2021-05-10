export class TokenHelper {
    get(): string | null {
        return localStorage.getItem('accessToken');
    }

    set(token: string): void {
        localStorage.setItem('accessToken', token);
    }

    delete() {
        localStorage.removeItem('accessToken');
    }
}
