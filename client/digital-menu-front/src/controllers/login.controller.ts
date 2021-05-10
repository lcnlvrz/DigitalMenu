import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Dispatch, useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginInitialValue } from '../initial-values/Login/login.initial-value';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { UserActionsTypes } from '../interfaces/User';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { AuthService } from '../services/auth.service';
import { RestaurantService } from '../services/restaurant.service';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const dispatch: Dispatch<AllActions> = useDispatch();

    const user = useSelector((state: RootState) => state.user);

    const authService = new AuthService();
    const restaurantService = new RestaurantService();

    const isDemo = new URL(window.location.href).searchParams.get('demo');

    const login = (input: typeof LoginInitialValue) => {
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        authService
            .login(input, cancelToken.token)
            .then((res) => {
                const { accessToken, user } = res.data;
                localStorage.setItem('accessToken', accessToken);
                const cancelToken = axios.CancelToken.source();
                setCancelTokenSource(cancelToken);
                restaurantService
                    .getRestaurant(accessToken)
                    .then((res) => {
                        dispatch({ type: UserActionsTypes.SET_USER, payload: user });
                        dispatch({ type: RestaurantActionsTypes.SET_RESTAURANT, payload: res.data });
                    })
                    .catch((err) => {
                        if (axios.isCancel(err)) return;
                        message.error(err.response?.data?.detail || 'Unexpected error to fetch restaurant');
                    });
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

    useEffect(() => {
        if (isDemo) {
            login({
                email: process.env.EMAIL_DEMO || 'digital.menu.crm@gmail.com',
                password: process.env.EMAIL_PASSWORD || 'digitalmenudemo',
            });
        }
    }, []);

    return { isLoading, login, user };
};
