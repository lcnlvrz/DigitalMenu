import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { DaysOfTheWeek, RestaurantActionsTypes, Schedule } from '../interfaces/Restaurant/restaurant.interface';
import { RestaurantService } from '../services/restaurant.service';
import { daysOfTheWeekArray, SetFieldValueFormik } from './modal-create-restaurant';
import { Dispatch } from 'redux';
import { AllActions } from '../redux/reducers/root-state.reducer';
import axios, { AxiosError, CancelTokenSource } from 'axios';

export interface ParamsControllerEditSchedule {
    handleOpen: () => void;
}

export const useModalEditSchedule = (params: ParamsControllerEditSchedule) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();
    const tokenController = useToken();
    const restaurantService = new RestaurantService();

    const dispatch: Dispatch<AllActions> = useDispatch();

    const addNewDay = (values: Schedule[], setFieldValue: SetFieldValueFormik) => {
        if (values.length === 7) {
            message.error('All week already added');
        } else {
            const newState = [...values];
            const daysAlreadyAdded = newState.map((day) => day.day);
            let day = '' as DaysOfTheWeek;
            for (let i = 0; i < daysOfTheWeekArray.length; i++) {
                const dayOfTheWeek = daysOfTheWeekArray[i] as DaysOfTheWeek;
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

    const saveChanges = (input: Schedule[]) => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        restaurantService
            .updateRestaurant({ schedule: input }, token, cancelToken.token)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.UPDATE_RESTAURANT, payload: { schedule: res.data.schedule } });
                params.handleOpen();
                message.success('Schedule updated successfully!');
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error happened!');
            });
    };

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return { addNewDay, isLoading, saveChanges };
};
