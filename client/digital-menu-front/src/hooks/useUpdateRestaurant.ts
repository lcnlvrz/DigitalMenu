import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { RestaurantActionsTypes, RestaurantInterface } from '../interfaces/Restaurant/restaurant.interface';
import { UserActionsTypes } from '../interfaces/User';
import { AllActions } from '../redux/reducers/root-state.reducer';
import { RestaurantService } from '../services/restaurant.service';

export interface UseUpdateRestaurantParams {
    setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}

export const useUpdateRestaurant = (params: UseUpdateRestaurantParams) => {
    const dispatch: Dispatch<AllActions> = useDispatch();
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const restaurantService = new RestaurantService();

    const execute = (input: Partial<RestaurantInterface>, clearState?: () => void, handleOpen?: () => void) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return dispatch({ type: UserActionsTypes.CLEAR_USER });
        params.setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        restaurantService
            .updateRestaurant(input, token, cancelToken.token)
            .then((res) => {
                params.setIsLoading(false);
                message.success('Saved successfully!');
                dispatch({ type: RestaurantActionsTypes.UPDATE_RESTAURANT, payload: res.data });
                if (handleOpen) {
                    handleOpen();
                }
                if (clearState) {
                    clearState();
                }
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                params.setIsLoading(false);
                message.error(err.response?.data?.detail || 'Error!');
            });
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { execute };
};
