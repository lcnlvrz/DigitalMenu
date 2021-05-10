import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { CampaingTriggered } from '../controllers/campaings-v2.controller';
import { MenuInterface, PlateInterface } from '../interfaces/Restaurant/restaurant.interface';

export interface CreateCampaingInput {
    title: string;
    description: string;
    banner: string;
    content: string;
    willTriggeredWhen: CampaingTriggered;
    startsAfterSeconds?: number;
    startsWhenSelectedMenu?: number;
    startsWhenSelectedPlate?: number;
    publish: boolean;
}

export interface Campaing {
    id: number;
    title: string;
    description: string;
    banner: string;
    content: string;
    willTriggeredWhen: CampaingTriggered;
    startsAfterSeconds?: number;
    startsWhenSelectedMenu?: MenuInterface;
    startsWhenSelectedPlate?: PlateInterface;
    createdAt: string;
    updatedAt: string;
    publish: boolean;
}

export class CampaingService {
    async getMany(token: string, cancelToken: CancelToken): Promise<AxiosResponse<Campaing[]>> {
        return await axiosAPI.get('/campaing', { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async create(
        input: CreateCampaingInput,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<Campaing>> {
        return await axiosAPI.post('/campaing', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async update(
        input: CreateCampaingInput,
        token: string,
        campaingId: number,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<Campaing>> {
        return await axiosAPI.put('/campaing/' + campaingId, input, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
    async delete(token: string, campaingId: number, cancelToken: CancelToken): Promise<AxiosResponse<Campaing>> {
        return await axiosAPI.delete('/campaing/' + campaingId, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
    async updatePublish(token: string, campaingId: number, cancelToken: CancelToken): Promise<AxiosResponse<Campaing>> {
        return await axiosAPI.get('/campaing/publish/' + campaingId, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
}
