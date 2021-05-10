import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';

export interface CreateTableInput {
    name: string;
    securityPassword: string;
}

export interface TableInterface {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    orders?: TableInterface[];
}

export class TableService {
    async create(
        input: CreateTableInput,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<TableInterface>> {
        return await axiosAPI.post('/table', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async getMany(token: string, cancelToken: CancelToken): Promise<AxiosResponse<TableInterface[]>> {
        return await axiosAPI.get('/table', { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async updateOne(
        input: Partial<CreateTableInput>,
        token: string,
        tableId: number,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<TableInterface>> {
        return await axiosAPI.put('/table/' + tableId, input, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async removeOne(token: string, tableId: number, cancelToken: CancelToken): Promise<AxiosResponse<TableInterface>> {
        return await axiosAPI.delete('/table/' + tableId, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async sendMailSecurityPasswords(token: string, cancelToken: CancelToken): Promise<AxiosResponse<any>> {
        return await axiosAPI.get('/table/security-passwords', {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
}
