import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { RestaurantInterface } from '../interfaces/Restaurant/restaurant.interface';
import { ReviewResponse } from './restaurant.service';
import { AnswerDto, SurveyForm } from './survey-form.service';

export enum PaymentMethod {
    EFFECTIVE = 'EFFECTIVE',
    OTHER_METHOD = 'OTHER_METHOD',
}

export enum OrderStatus {
    IN_QUEUE = 'IN_QUEUE',
    COOKING = 'COOKING',
    WITH_DELAY = 'WITH_DELAY',
    DELIVERED = 'DELIVERED',
    DONE = 'DONE',
    CANCELED = 'CANCELED',
    ALL = 'ALL',
}

export interface PlateMinimized {
    id: number;
    quantity: number;
}

export interface CreateOrder {
    firstName: string;
    lastName: string;
    plates: PlateMinimized[];
    tableId?: number;
    securityPassword: string;
    paymentMethod?: PaymentMethod;
    clarifications?: string;
}

export enum SurveyFormResponseStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

export interface SurveyFormResponse {
    id: number;
    createdAt: string;
    updatedAt: string;
    answers: AnswerDto[];
    status: SurveyFormResponseStatus;
    surveyForm: SurveyForm;
    order: OrderInterface;
}

export interface PlateInOrderDto {
    title: string;
    quantity: number;
    subtotal: number;
    weight: number;
}

export interface OrderInterface {
    id: number;
    firstName: string;
    lastName: string;
    plates: PlateInOrderDto[];
    review?: ReviewResponse;
    restaurant: RestaurantInterface;
    paymentMethod?: PaymentMethod;
    surveyFormResponse?: SurveyFormResponse;
    tableName: string;
    clarifications?: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    total: number;
}

export interface UpdateOrderInput {
    newStatus: OrderStatus;
    sortBy?: OrderStatus;
}

export interface IPaginationMeta {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IPaginationLinks {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
}

export interface PaginationResponseOrder {
    items: OrderInterface[];
    meta: IPaginationMeta;
    links?: IPaginationLinks;
}

export class OrderService {
    async createOrder(
        input: CreateOrder,
        restaurantId: number,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<OrderInterface>> {
        return await axiosAPI.post('/order/' + restaurantId, input, { cancelToken });
    }
    async getOrderById(orderId: number, cancelToken: CancelToken): Promise<AxiosResponse<OrderInterface>> {
        return await axiosAPI.get('/order/' + orderId, { cancelToken });
    }

    async updateOrderById(
        orderId: number,
        token: string,
        input: UpdateOrderInput,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<OrderInterface[]>> {
        return await axiosAPI.put('/order/' + orderId, input, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }

    async getMany(
        token: string,
        cancelToken: CancelToken,
        query?: string,
    ): Promise<AxiosResponse<PaginationResponseOrder>> {
        return await axiosAPI.get('/order/paginate' + query, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
}
