import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Dispatch, useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterInterface } from '../interfaces/Register/register.interface';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { UserActionsTypes } from '../interfaces/User';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { AuthService } from '../services/auth.service';
import { RestaurantService } from '../services/restaurant.service';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const authService = new AuthService();
    const restaurantService = new RestaurantService();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const user = useSelector((state: RootState) => state.user);

    const register = (input: RegisterInterface) => {
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        authService
            .register(input, cancelToken.token)
            .then((res) => {
                const { accessToken, user } = res.data;
                const cancelToken = axios.CancelToken.source();
                setCancelTokenSource(cancelToken);
                restaurantService
                    .getRestaurant(accessToken)
                    .then((res) => {
                        setIsLoading(false);
                        dispatch({ type: RestaurantActionsTypes.SET_RESTAURANT, payload: res.data });
                        localStorage.setItem('accessToken', accessToken);
                        dispatch({ type: UserActionsTypes.SET_USER, payload: user });
                    })
                    .catch((err) => {
                        if (axios.isCancel(err)) return;
                        setIsLoading(false);
                        message.error(err.response?.data?.detail || 'Unexpected error to fetch restaurant');
                    });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.message);
            });
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { register, isLoading, user };
};
