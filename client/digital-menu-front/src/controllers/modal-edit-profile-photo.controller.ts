import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Dispatch, useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RestaurantActionsTypes, RestaurantInterface } from '../interfaces/Restaurant/restaurant.interface';
import { AllActions } from '../redux/reducers/root-state.reducer';
import { RestaurantService } from '../services/restaurant.service';

export const useModalEditProfilePhoto = () => {
    const [isUpdatingProfilePhoto, setIsUpdatingProfilePhoto] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfilePhoto = () => {
        if (isUpdatingProfilePhoto) {
            setIsUpdatingProfilePhoto(false);
        } else {
            setIsUpdatingProfilePhoto(true);
        }
    };

    const restaurantService = new RestaurantService();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const deletePhoto = (input: Partial<RestaurantInterface>) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        restaurantService
            .updateRestaurant(input, token, cancelToken.token)
            .then((res) => {
                dispatch({ type: RestaurantActionsTypes.SET_RESTAURANT, payload: res.data });
                setIsLoading(false);
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail);
            });
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { handleUpdateProfilePhoto, isUpdatingProfilePhoto, deletePhoto, isLoading };
};
