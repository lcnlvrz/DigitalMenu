import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';
import { RestaurantInterface } from '../interfaces/Restaurant/restaurant.interface';
import { RestaurantService } from '../services/restaurant.service';
import { AnswerDto } from '../services/survey-form.service';

export type AnswerDtoExtended = AnswerDto & { createdAt: string; name: string };

export interface IsRestaurantOpen {
    opensAt?: string;
    closesAt?: string;
    isDayMatched: boolean;
    reviewsSurveyForm?: AnswerDtoExtended[];
    nextNearDay?: string;
}

export type RestaurantInterfaceExtended = IsRestaurantOpen & RestaurantInterface;

export const useRestaurantSearcher = () => {
    const [queryValue, setQueryValue] = useState('');
    const [restaurants, setRestaurants] = useState<RestaurantInterfaceExtended[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const restaurantService = new RestaurantService();

    useEffect(() => {
        if (!queryValue) return;
        setIsLoading(true);
        const timer = setTimeout(() => {
            const cancelToken = axios.CancelToken.source();
            setCancelTokenSource(cancelToken);
            restaurantService
                .searchRestaurant(queryValue, cancelToken.token)
                .then((res) => {
                    setIsLoading(false);
                    setRestaurants(res.data);
                })
                .catch((err: AxiosError) => {
                    if (axios.isCancel(err)) return;
                    setIsLoading(false);
                    message.error(err.response?.data?.detail || 'Unexpected error!');
                });
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [queryValue]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { queryValue, restaurants, setQueryValue, isLoading };
};
