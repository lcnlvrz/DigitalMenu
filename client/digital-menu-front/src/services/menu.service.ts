import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { CreatePlate } from '../components/AddPlate/AddPlate';
import { MenuStatusFilter } from '../controllers/my-menu.controller';
import {
    CreateMenu,
    MenuInterface,
    PlateInterface,
    StatusMenuAndPlate,
} from '../interfaces/Restaurant/restaurant.interface';
import { IPaginationLinks, IPaginationMeta } from './order.service';

export type CreatePlateWithoutPrice = Omit<CreatePlate, 'price'>;

export interface CreatePlateExtendedForAPi {
    price: number;
    image: string;
    menuId: number;
}

export type CreatePlateInput = CreatePlateWithoutPrice & CreatePlateExtendedForAPi;

export interface PlateExtended {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    image: string;
    menuId: number;
    price: number;
    status: StatusMenuAndPlate;
}

export type CreatePlateResponse = CreatePlateWithoutPrice & PlateExtended;

export interface PlatesIds {
    platesIds: number[];
}

export interface MenusIds {
    menusIds: number[];
}

export type UpdateMenu = Partial<MenuInterface> & MenusIds;

export type UpdatePlate = Partial<CreatePlateResponse> & PlatesIds;

export interface PaginationResponseMenu {
    items: MenuInterface[];
    meta: IPaginationMeta;
    links?: IPaginationLinks;
}

export class MenuService {
    async getMany(token: string, cancelToken: CancelToken): Promise<AxiosResponse<MenuInterface[]>> {
        return axiosAPI.get('/menu', { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async getOneById(menuId: number, cancelToken: CancelToken): Promise<AxiosResponse<MenuInterface>> {
        return axiosAPI.get('/menu/id/' + menuId, { cancelToken });
    }

    async create(input: CreateMenu, token: string, cancelToken: CancelToken): Promise<AxiosResponse<MenuInterface>> {
        return axiosAPI.post('/menu', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async createPlate(
        input: CreatePlateInput,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<CreatePlateResponse>> {
        return await axiosAPI.post('/menu/plate', input, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async updatePlate(input: UpdatePlate, token: string, cancelToken: CancelToken): Promise<AxiosResponse<void>> {
        return axiosAPI.put('/menu/plate', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async updateMenu(input: UpdateMenu, token: string, cancelToken: CancelToken): Promise<AxiosResponse<void>> {
        return axiosAPI.put('/menu', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async updatePlateInformation(
        input: UpdatePlate,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<void>> {
        return axiosAPI.put('/menu/plate', input, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async removeMenu(menusIds: number[], token: string, cancelToken: CancelToken): Promise<AxiosResponse<void>> {
        return axiosAPI.delete('/menu', {
            data: { menusIds },
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async removePlate(platesIds: number[], token: string, cancelToken: CancelToken): Promise<AxiosResponse<void>> {
        return axiosAPI.delete('/menu/plate', {
            data: { platesIds },
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async getPlatesByName(
        plateName: string,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<PlateInterface[]>> {
        return await axiosAPI.get('/menu/plate/' + plateName, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async getMenusbyName(
        menuName: string,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<MenuInterface[]>> {
        return await axiosAPI.get('/menu/' + menuName, { headers: { Authorization: 'Bearer ' + token }, cancelToken });
    }

    async getManyWithPagination(
        query: string,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<PaginationResponseMenu>> {
        return await axiosAPI.get('/menu/pagination' + query, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async updatePlateViews(plateId: number, cancelToken: CancelToken): Promise<AxiosResponse<PlateInterface>> {
        return await axiosAPI.get('/menu/plate/views/' + plateId, { cancelToken });
    }

    async duplicateMenu(
        menuId: number,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<MenuInterface>> {
        return await axiosAPI.post(
            '/menu/duplicate/' + menuId,
            {},
            { headers: { Authorization: 'Bearer ' + token }, cancelToken },
        );
    }

    async duplicatePlate(
        plateId: number,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<CreatePlateResponse>> {
        return await axiosAPI.post(
            '/menu/plate/duplicate/' + plateId,
            {},
            { headers: { Authorization: 'Bearer ' + token }, cancelToken },
        );
    }

    async getPlatesByQuery(
        menuId: number,
        title: string,
        status: StatusMenuAndPlate | string,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<PlateInterface[]>> {
        return await axiosAPI.get('/menu/plate/query?menuId=' + menuId + '&title=' + title + '&status=' + status, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
}
