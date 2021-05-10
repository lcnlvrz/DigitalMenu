import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { LoginInitialValue } from '../initial-values/Login/login.initial-value';
import { RegisterInterface, RegisterOutputDto } from '../interfaces/Register/register.interface';
import { UserInterface } from '../interfaces/User';

export class AuthService {
    async me(token: string): Promise<AxiosResponse<UserInterface>> {
        return await axiosAPI.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    async register(input: RegisterInterface, cancelToken: CancelToken): Promise<AxiosResponse<RegisterOutputDto>> {
        return await axiosAPI.post('/auth/register', input, { cancelToken });
    }

    async login(input: typeof LoginInitialValue, cancelToken: CancelToken): Promise<AxiosResponse<RegisterOutputDto>> {
        return await axiosAPI.post('/auth/login', input, { cancelToken });
    }

    async sendMailResetPassword(email: string, cancelToken: CancelToken): Promise<AxiosResponse<RegisterOutputDto>> {
        return await axiosAPI.post('/auth/mail-password', { email }, { cancelToken });
    }
}
