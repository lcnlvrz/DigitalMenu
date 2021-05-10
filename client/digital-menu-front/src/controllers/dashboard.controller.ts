import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToken } from '../hooks/useToken';
import { AllActions, RootState } from '../redux/reducers/root-state.reducer';
import { OrderService } from '../services/order.service';
import { Dispatch } from 'redux';
import { RestaurantActionsTypes } from '../interfaces/Restaurant/restaurant.interface';
import { message } from 'antd';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import moment from 'moment';
import { SurveyFormService } from '../services/survey-form.service';

export const useDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>();

    const restaurant = useSelector((state: RootState) => state.restaurant);
    const recentOrders = useSelector((state: RootState) => state.restaurant.orders);
    const recentReviews = useSelector((state: RootState) => state.restaurant.surveyFormsResponses);
    const user = useSelector((state: RootState) => state.user);

    const orderService = new OrderService();
    const surveyFormService = new SurveyFormService();

    const dashboardCards = [
        {
            title: 'Edit your menu',
            color: 'blue-500',
            paragraph: 'Create new menus, add or edit your plates and sections in your menus',
            button: 'Menus',
            route: '/dashboard/my-menus',
        },
        {
            title: 'Config your restaurant',
            paragraph: 'Edit the profile information about your restaurant',
            color: 'red-500',
            button: 'Restaurant',
            route: '/dashboard/my-restaurant',
        },
        {
            title: 'Manage your customers and orders',
            color: 'green-500',
            paragraph: "Manage your restaurant's orders and give the best service as much as possible",
            button: 'Orders',
            route: '/dashboard/my-customers',
        },
    ];

    const tokenController = useToken();
    const dispatch: Dispatch<AllActions> = useDispatch();

    const fetchNewOrders = () => {
        const token = tokenController.execute();
        if (!token) return;
        const startDate = moment().add(-1, 'day').toISOString();
        const endDate = moment().toISOString();
        const query =
            '?rangeDate=true&start=' + startDate + '&end=' + endDate + '&page=1&limit=5&order=DESCEND&field=createdAt';
        setIsLoading(true);
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        orderService
            .getMany(token, cancelToken.token, query)
            .then((res) => {
                setIsLoading(false);
                dispatch({ type: RestaurantActionsTypes.SET_ORDERS, payload: res.data.items });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoading(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };
    const fetchNewReviews = () => {
        const token = tokenController.execute();
        if (!token) return;
        setIsLoadingReviews(true);
        const startDate = moment().add(-1, 'day').toISOString();
        const endDate = moment().toISOString();
        const query =
            '?limit=5&page=1&order=DESC&field=createdAt' + '&rangeDate=true&start=' + startDate + '&end=' + endDate;
        const cancelToken = axios.CancelToken.source();
        setCancelTokenSource(cancelToken);
        surveyFormService
            .getManySurveyFormResponses(token, cancelToken.token, query)
            .then((res) => {
                setIsLoadingReviews(false);
                dispatch({ type: RestaurantActionsTypes.SET_SURVEY_FORMS_RESPONSES, payload: res.data.items });
            })
            .catch((err: AxiosError) => {
                if (axios.isCancel(err)) return;
                setIsLoadingReviews(false);
                message.error(err.response?.data?.detail || 'Unexpected error!');
            });
    };

    useEffect(() => {
        if (!restaurant.isLoading) {
            fetchNewOrders();
            fetchNewReviews();
        }
    }, [restaurant.isLoading]);

    useEffect(() => {
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel();
            }
        };
    }, [cancelTokenSource]);

    return {
        recentOrders,
        dashboardCards,
        user,
        fetchNewOrders,
        isLoading,
        recentReviews,
        fetchNewReviews,
        isLoadingReviews,
    };
};
