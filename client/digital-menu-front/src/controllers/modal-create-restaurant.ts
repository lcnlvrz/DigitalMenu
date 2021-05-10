import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Dispatch } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { RestaurantInitialValue } from '../initial-values/Restaurant/restaurant.initial-value';
import { DaysOfTheWeek, RestaurantActionsTypes, Schedule } from '../interfaces/Restaurant/restaurant.interface';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { RestaurantService } from '../services/restaurant.service';
import { SelectOption } from './reports.controller';

export const daysOfTheWeekArray: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export const daysOfTheWeek: SelectOption[] = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
];

export type SetFieldValueFormik = (field: string, value: any, shouldValidate?: boolean | undefined) => void;

export const useModalCreateRestaurant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const restaurant = useSelector((state: RootState) => state.restaurant);
    const user = useSelector((state: RootState) => state.user);
    const dispatch: Dispatch<AllActions> = useDispatch();
    const tokenController = useToken();

    const restaurantService = new RestaurantService();

    const createRestaurant = (input: typeof RestaurantInitialValue) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        restaurantService
            .createRestaurant({ ...input, cellphone: input.cellphone.toString() }, token, cancelToken.token)
            .then((res) => {
                const { owner, ...restaurant } = res.data;
                dispatch({ type: RestaurantActionsTypes.SET_RESTAURANT, payload: restaurant });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.message);
            });
    };

    const addNewDay = (values: Schedule[], setFieldValue: SetFieldValueFormik) => {
        if (values.length === 7) {
            message.error('All week already added');
        } else {
            const newState = [...values];
            const daysAlreadyAdded = newState.map((day) => day.day);
            let day = '' as DaysOfTheWeek;
            for (let i = 0; i < daysOfTheWeek.length; i++) {
                const dayOfTheWeek = daysOfTheWeek[i].value as DaysOfTheWeek;
                if (daysAlreadyAdded.indexOf(dayOfTheWeek) === -1) {
                    day = dayOfTheWeek;
                    break;
                }
            }
            newState.push({
                day,
                hour: ['08:00', '16:00'],
            });
            setFieldValue('schedule', newState);
        }
    };

    useEffect(() => {
        if (!restaurant.id && !restaurant.isLoading && !user.isLoading) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [restaurant]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { isOpen, createRestaurant, isLoading, daysOfTheWeek, addNewDay };
};
