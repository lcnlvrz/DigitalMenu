import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { UserInterface } from '../interfaces/User';

export interface UpdateUserInput {
    firstName: string;
    lastName: string;
}

export class UserService {
    async updateUser(
        input: UpdateUserInput,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<UserInterface>> {
        return await axiosAPI.put('/user', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async resetPassword(newPassword: string, token: string, cancelToken: CancelToken): Promise<AxiosResponse<any>> {
        return await axiosAPI.put(
            '/user/password',
            { newPassword },
            { headers: { Authorization: 'Bearer ' + token }, cancelToken },
        );
    }
}
