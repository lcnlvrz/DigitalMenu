import { AxiosResponse, CancelToken } from 'axios';
import { axiosAPI } from '../axios/axios.instance';
import { Review } from '../controllers/customer-order-portal.controller';
import { RestaurantInterfaceExtended } from '../controllers/restaurant-searcher.controller';
import { RestaurantInitialValue } from '../initial-values/Restaurant/restaurant.initial-value';
import { CreateRestaurantResponse, RestaurantInterface } from '../interfaces/Restaurant/restaurant.interface';
import { OrderInterface } from './order.service';

export interface ReviewExtended {
    createdAt: string;
    updatedAt: string;
    id: number;
    order: OrderInterface;
}

export type ReviewResponse = ReviewExtended & Review;

export class RestaurantService {
    async getRestaurant(token: string): Promise<AxiosResponse<RestaurantInterface>> {
        return await axiosAPI.get('/restaurant', { headers: { Authorization: 'Bearer' + ' ' + token } });
    }

    async createRestaurant(
        input: typeof RestaurantInitialValue,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<CreateRestaurantResponse>> {
        return await axiosAPI.post('/restaurant', input, {
            headers: { Authorization: 'Bearer' + ' ' + token },
            cancelToken,
        });
    }

    async updateRestaurant(
        input: Partial<RestaurantInterface>,
        token: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<Partial<RestaurantInterface>>> {
        return await axiosAPI.put('/restaurant', input, {
            headers: { Authorization: 'Bearer' + ' ' + token },
            cancelToken,
        });
    }

    async searchRestaurant(
        query: string,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<RestaurantInterfaceExtended[]>> {
        return await axiosAPI.get('/restaurant/name/' + query, { cancelToken });
    }

    async getRestaurantbyId(id: number, cancelToken: CancelToken): Promise<AxiosResponse<RestaurantInterfaceExtended>> {
        return await axiosAPI.get('/restaurant/id/' + id, { cancelToken });
    }

    async createReview(
        input: Review,
        orderId: number,
        cancelToken: CancelToken,
    ): Promise<AxiosResponse<ReviewResponse>> {
        return await axiosAPI.post('/restaurant/review/' + orderId, input, { cancelToken });
    }

    async getReviews(
        token: string,
        cancelToken: CancelToken,
        query?: string,
    ): Promise<AxiosResponse<ReviewResponse[]>> {
        return await axiosAPI.get('/restaurant/reviews' + query, {
            headers: { Authorization: 'Bearer ' + token },
            cancelToken,
        });
    }
}
